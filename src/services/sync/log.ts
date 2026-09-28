import type { SyncOp } from './types';
import type { StorageItems } from '@/storage';

export interface SyncLogApi {
  append: (op: SyncOp | SyncOp[]) => void;
  clearPrefix: (count: number) => Promise<void>;
}

export const SYNC_LOG_LOCK_NAME = 'read-it-later:syncLog';

export function createSyncLogApi(
  items: Pick<StorageItems, 'syncLog'>,
  isEnabled: () => boolean,
): SyncLogApi {
  async function enqueue<T>(task: () => Promise<T>): Promise<T> {
    return navigator.locks.request(SYNC_LOG_LOCK_NAME, task);
  }

  function append(op: SyncOp | SyncOp[]): void {
    if (!isEnabled())
      return;
    const ops = Array.isArray(op) ? op : [op];
    void enqueue(async () => {
      const log = await items.syncLog.getValue();
      await items.syncLog.setValue([...log, ...ops]);
    }).catch(err => console.error('[sync] append log failed:', err));
  }

  async function clearPrefix(count: number): Promise<void> {
    await enqueue(async () => {
      const log = await items.syncLog.getValue();
      await items.syncLog.setValue(log.slice(count));
    });
  }

  return { append, clearPrefix };
}
