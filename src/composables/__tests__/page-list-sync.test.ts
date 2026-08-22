import type { Mock } from 'vitest';
import type { PageInfo, PageItem } from '@/common/types';
import type { SyncAddOp, SyncLogCallback, SyncOp } from '@/services/sync/types';
import { flushPromises } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { usePageList } from '@/composables/page-list';
import { createStorageItems } from '@/storage';

/** Unwrap a single (non-batch) op of the expected variant from a log call. */
function opOf<T extends SyncOp['t']>(call: [SyncOp | SyncOp[]], t: T): Extract<SyncOp, { t: T }> {
  const [op] = call;
  if (Array.isArray(op) || op.t !== t)
    throw new Error(`expected a single ${t} op`);
  return op as Extract<SyncOp, { t: T }>;
}

function createTestPageItem(id: string): PageItem {
  return {
    id,
    favorited: false,
    tags: ['tag1', 'tag2'],
    desc: '',
    info: createTestPageInfo(id),
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  };
}

function createTestPageInfo(id: string): PageInfo {
  return {
    title: `Test Page ${id}`,
    url: `https://example.com/page/${id}`,
  };
}

const defaultPageList = [
  createTestPageItem('1'),
  createTestPageItem('2'),
  createTestPageItem('3'),
];

const items = createStorageItems();

let spy: Mock<SyncLogCallback>;

async function setup() {
  await items.pageList.setValue(defaultPageList);
  spy = vi.fn<SyncLogCallback>();
  const obj = usePageList(items, spy);
  await flushPromises();
  return obj;
}

beforeEach(() => {
  fakeBrowser.reset();
});

describe('mutation -> sync op mapping', () => {
  it('add logs a self-contained item snapshot', async () => {
    const { add } = await setup();
    add(createTestPageInfo('4'));
    expect(spy).toHaveBeenCalledTimes(1);
    const op = opOf(spy.mock.calls[0], 'add');
    expect(op.t).toBe('add');
    expect(op.item.info).toEqual(createTestPageInfo('4'));
    expect(op.item.id).toBeTypeOf('string');
    expect(op.item.createdAt).toBeTypeOf('string');
  });

  it('duplicate-url add logs nothing', async () => {
    const { add } = await setup();
    add(createTestPageInfo('1'));
    expect(spy).not.toHaveBeenCalled();
  });

  it('remove logs a remove op by id', async () => {
    const { remove } = await setup();
    remove('1');
    expect(spy).toHaveBeenCalledWith({ t: 'remove', id: '1' });
  });

  it('update logs a field patch with the new updatedAt', async () => {
    const { update } = await setup();
    update('2', { title: 'New Title', tags: ['new'], desc: 'New desc' });
    expect(spy).toHaveBeenCalledTimes(1);
    const op = opOf(spy.mock.calls[0], 'update');
    expect(op.t).toBe('update');
    expect(op.id).toBe('2');
    expect(op.patch).toMatchObject({ title: 'New Title', tags: ['new'], desc: 'New desc' });
    expect(op.patch.updatedAt).toBeTypeOf('string');
    expect(op.patch.updatedAt).not.toBe('2023-01-01T00:00:00Z');
  });

  it('updateTitle logs a title patch', async () => {
    const { updateTitle } = await setup();
    updateTitle('2', 'Renamed');
    expect(spy).toHaveBeenCalledTimes(1);
    const op = opOf(spy.mock.calls[0], 'update');
    expect(op.t).toBe('update');
    expect(op.patch.title).toBe('Renamed');
    expect(op.patch.updatedAt).toBeTypeOf('string');
  });

  it('updateUrl logs a url patch on success only', async () => {
    const { updateUrl } = await setup();
    updateUrl('1', 'https://example.com/new-url');
    expect(spy).toHaveBeenCalledTimes(1);
    const op = opOf(spy.mock.calls[0], 'update');
    expect(op.t).toBe('update');
    expect(op.patch.url).toBe('https://example.com/new-url');

    spy.mockClear();
    updateUrl('1', 'https://example.com/page/2'); // collides with item 2
    expect(spy).not.toHaveBeenCalled();
  });

  it('toggleFavorite logs the new favorited state', async () => {
    const { toggleFavorite } = await setup();
    toggleFavorite('3');
    expect(spy).toHaveBeenCalledTimes(1);
    const op = opOf(spy.mock.calls[0], 'update');
    expect(op.t).toBe('update');
    expect(op.patch.favorited).toBe(true);
    expect(op.patch.updatedAt).toBeTypeOf('string');
  });

  it('moveToTop logs a moveToTop op', async () => {
    const { moveToTop } = await setup();
    moveToTop('3');
    expect(spy).toHaveBeenCalledWith({ t: 'moveToTop', id: '3' });
  });

  it('clear logs one batch of remove ops for every pre-clear item', async () => {
    const { clear } = await setup();
    clear();
    expect(spy).toHaveBeenCalledTimes(1);
    const arg = spy.mock.calls[0][0];
    expect(arg).toEqual([
      { t: 'remove', id: '1' },
      { t: 'remove', id: '2' },
      { t: 'remove', id: '3' },
    ]);
  });

  it('restoreRemoved logs an add op with the restored item', async () => {
    const { remove, restoreRemoved } = await setup();
    remove('2');
    spy.mockClear();
    restoreRemoved();
    expect(spy).toHaveBeenCalledTimes(1);
    const op = opOf(spy.mock.calls[0], 'add');
    expect(op.t).toBe('add');
    expect(op.item.id).toBe('2');
  });

  it('load logs added items in reverse so replay restores the import order', async () => {
    const { tryLoad, load } = await setup();
    const newPages = [
      createTestPageItem('4'),
      createTestPageItem('5'),
      createTestPageItem('6'),
    ];
    spy.mockClear();
    load(tryLoad(newPages));

    const addedOps = spy.mock.calls
      .map(call => call[0])
      .filter((op): op is SyncAddOp => !Array.isArray(op) && op.t === 'add');
    expect(addedOps.map(op => op.item.id)).toEqual(['6', '5', '4']);
  });
});
