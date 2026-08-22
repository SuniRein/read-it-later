import type { PageItem } from '@/common/types';
import type { CloudService } from '@/services/cloud/types';
import type { SyncOp } from '@/services/sync/types';
import { flushPromises } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { serializePageList } from '@/services/serialization';
import { createSyncLogApi } from '@/services/sync/log';
import { runSync } from '@/services/sync/runner';
import { createStorageItems } from '@/storage';

const items = createStorageItems();
const syncLog = createSyncLogApi(items, () => true);

function createItem(id: string): PageItem {
  return {
    id,
    info: { title: `Page ${id}`, url: `https://example.com/${id}` },
    tags: [],
    desc: '',
    favorited: false,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  };
}

function createStubService(overrides: Partial<CloudService> = {}): CloudService {
  return {
    preflight: vi.fn(async () => true),
    findSyncFile: vi.fn(async () => null),
    get: vi.fn(async () => ''),
    saveSyncFile: vi.fn(async () => {}),
    ...overrides,
  } as CloudService;
}

beforeEach(() => {
  fakeBrowser.reset();
});

describe('runSync', () => {
  it('first sync with no cloud file uploads the full local table and clears the log', async () => {
    const local = [createItem('a'), createItem('b')];
    await items.pageList.setValue(local);
    await items.syncLog.setValue([{ t: 'add', item: createItem('a') }]);

    const saveSyncFile = vi.fn(async () => {});
    const service = createStubService({ saveSyncFile });
    const result = await runSync({ items, service, syncLog });

    expect(result).toEqual({ status: 'synced' });
    expect(saveSyncFile).toHaveBeenCalledWith(serializePageList(local));
    expect(await items.pageList.getValue()).toEqual(local);
    expect(await items.syncLog.getValue()).toEqual([]);
    expect(await items.lastSyncFailed.getValue()).toBe(false);
    // Cross-context writes must bump lastModified so bound stores refresh.
    const pageListMeta = await items.pageList.getMeta() as { lastModified?: number };
    expect(pageListMeta.lastModified).toBeTypeOf('number');
  });

  it('replays local ops onto the cloud base and tombstones deleted items', async () => {
    const local = [createItem('a'), createItem('b')];
    const ops: SyncOp[] = [{ t: 'remove', id: 'a' }];
    await items.pageList.setValue(local);
    await items.syncLog.setValue(ops);

    const base = [createItem('a'), createItem('b')];
    const service = createStubService({
      findSyncFile: vi.fn(async () => ({ id: 'sync-id', name: 'read-it-later-sync.json', size: 0 })),
      get: vi.fn(async () => serializePageList(base)),
      saveSyncFile: vi.fn(async () => {}),
    });
    const result = await runSync({ items, service, syncLog });

    expect(result).toEqual({ status: 'synced' });
    expect(await items.pageList.getValue()).toEqual([createItem('b')]);
    expect(await items.syncLog.getValue()).toEqual([]);
    const removed = await items.removedPageList.getValue();
    expect(removed.map(item => item.id)).toEqual(['a']);
    expect(await items.lastSyncFailed.getValue()).toBe(false);
  });

  it('push failure leaves local state, log and cloud untouched and marks failure', async () => {
    const local = [createItem('a')];
    await items.pageList.setValue(local);
    await items.syncLog.setValue([{ t: 'remove', id: 'a' }]);

    const service = createStubService({
      findSyncFile: vi.fn(async () => ({ id: 'sync-id', name: 'read-it-later-sync.json', size: 0 })),
      get: vi.fn(async () => serializePageList(local)),
      saveSyncFile: vi.fn(async () => { throw new Error('network down'); }),
    });
    const result = await runSync({ items, service, syncLog });

    expect(result.status).toBe('failed');
    expect(await items.pageList.getValue()).toEqual(local);
    expect(await items.syncLog.getValue()).toEqual([{ t: 'remove', id: 'a' }]);
    expect(await items.removedPageList.getValue()).toEqual([]);
    expect(await items.lastSyncFailed.getValue()).toBe(true);
  });

  it('corrupt cloud file returns failed without touching local state', async () => {
    const local = [createItem('a')];
    await items.pageList.setValue(local);
    await items.syncLog.setValue([{ t: 'remove', id: 'a' }]);

    const service = createStubService({
      findSyncFile: vi.fn(async () => ({ id: 'sync-id', name: 'read-it-later-sync.json', size: 0 })),
      get: vi.fn(async () => 'not-json'),
    });
    const result = await runSync({ items, service, syncLog });

    expect(result.status).toBe('failed');
    expect(await items.pageList.getValue()).toEqual(local);
    expect(await items.syncLog.getValue()).toEqual([{ t: 'remove', id: 'a' }]);
    expect(await items.lastSyncFailed.getValue()).toBe(true);
  });

  it('skips when preflight fails', async () => {
    await items.pageList.setValue([createItem('a')]);
    await items.syncLog.setValue([{ t: 'remove', id: 'a' }]);

    const saveSyncFile = vi.fn(async () => {});
    const service = createStubService({ preflight: vi.fn(async () => false), saveSyncFile });
    const result = await runSync({ items, service, syncLog });

    expect(result).toEqual({ status: 'skipped' });
    expect(await items.pageList.getValue()).toEqual([createItem('a')]);
    expect(await items.syncLog.getValue()).toEqual([{ t: 'remove', id: 'a' }]);
    expect(await items.lastSyncFailed.getValue()).toBe(false);
    expect(saveSyncFile).not.toHaveBeenCalled();
    await flushPromises();
  });

  it('skips without force when the log is empty', async () => {
    await items.pageList.setValue([createItem('a')]);

    const saveSyncFile = vi.fn(async () => {});
    const service = createStubService({ saveSyncFile });
    const result = await runSync({ items, service, syncLog });

    expect(result).toEqual({ status: 'skipped' });
    expect(saveSyncFile).not.toHaveBeenCalled();
  });

  it('force sync pulls from the cloud with an empty log', async () => {
    const local = [createItem('a')];
    await items.pageList.setValue(local);

    const base = [createItem('a'), createItem('b')];
    const saveSyncFile = vi.fn(async () => {});
    const service = createStubService({
      findSyncFile: vi.fn(async () => ({ id: 'sync-id', name: 'read-it-later-sync.json', size: 0 })),
      get: vi.fn(async () => serializePageList(base)),
      saveSyncFile,
    });
    const result = await runSync({ items, service, syncLog }, { force: true });

    expect(result).toEqual({ status: 'synced' });
    expect(await items.pageList.getValue()).toEqual([createItem('a'), createItem('b')]);
    expect(saveSyncFile).toHaveBeenCalledWith(serializePageList([createItem('a'), createItem('b')]));
  });
});
