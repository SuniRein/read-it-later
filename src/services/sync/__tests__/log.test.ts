import { flushPromises } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createSyncLogApi } from '@/services/sync/log';
import { createStorageItems } from '@/storage';

const items = createStorageItems();

beforeEach(() => {
  fakeBrowser.reset();
});

describe('createSyncLogApi', () => {
  it('serializes consecutive appends without dropping ops', async () => {
    const { append } = createSyncLogApi(items);
    append({ t: 'remove', id: '1' });
    append({ t: 'remove', id: '2' });
    await flushPromises();

    expect(await items.syncLog.getValue()).toEqual([
      { t: 'remove', id: '1' },
      { t: 'remove', id: '2' },
    ]);
  });

  it('appends a batch array in a single write', async () => {
    const { append } = createSyncLogApi(items);
    append([
      { t: 'remove', id: '1' },
      { t: 'remove', id: '2' },
    ]);
    await flushPromises();

    expect(await items.syncLog.getValue()).toEqual([
      { t: 'remove', id: '1' },
      { t: 'remove', id: '2' },
    ]);
  });

  it('keeps pre-existing log entries', async () => {
    await items.syncLog.setValue([{ t: 'remove', id: 'old' }]);
    const { append } = createSyncLogApi(items);
    append({ t: 'remove', id: 'new' });
    await flushPromises();

    expect(await items.syncLog.getValue()).toEqual([
      { t: 'remove', id: 'old' },
      { t: 'remove', id: 'new' },
    ]);
  });

  it('writes a batch array in a single storage write', async () => {
    const setValueSpy = vi.fn();
    const originalSetValue = items.syncLog.setValue.bind(items.syncLog);
    items.syncLog.setValue = setValueSpy;
    setValueSpy.mockImplementation(originalSetValue);

    const { append } = createSyncLogApi(items);
    append([
      { t: 'remove', id: '1' },
      { t: 'remove', id: '2' },
    ]);
    await flushPromises();

    expect(setValueSpy).toHaveBeenCalledTimes(1);
    expect(setValueSpy).toHaveBeenCalledWith([
      { t: 'remove', id: '1' },
      { t: 'remove', id: '2' },
    ]);

    items.syncLog.setValue = originalSetValue;
  });

  it('clearPrefix removes exactly the applied prefix', async () => {
    const { append, clearPrefix } = createSyncLogApi(items);
    append([
      { t: 'remove', id: '1' },
      { t: 'remove', id: '2' },
      { t: 'remove', id: '3' },
    ]);
    await flushPromises();

    await clearPrefix(2);
    expect(await items.syncLog.getValue()).toEqual([{ t: 'remove', id: '3' }]);
  });

  it('serializes clearPrefix against a concurrent append', async () => {
    const { append, clearPrefix } = createSyncLogApi(items);
    append({ t: 'remove', id: '1' });
    await flushPromises();

    const cleared = clearPrefix(1);
    append({ t: 'remove', id: '2' });
    await cleared;
    await flushPromises();

    // The append enqueued after the clear survives; the applied prefix is gone.
    expect(await items.syncLog.getValue()).toEqual([{ t: 'remove', id: '2' }]);
  });
});
