import type { SyncOp } from './types';
import type { StorageItems } from '@/storage';

export interface SyncLogApi {
  append: (op: SyncOp | SyncOp[]) => void;
  clearPrefix: (count: number) => Promise<void>;
}

export function createSyncLogApi(
  items: Pick<StorageItems, 'syncLog'>,
  isEnabled: () => boolean,
): SyncLogApi {
  // Serialize reads-modify-writes within this context so consecutive appends
  // and the sync-run clear never drop ops.
  let chain: Promise<void> = Promise.resolve();

  async function enqueue<T>(task: () => Promise<T>): Promise<T> {
    const result = chain.then(task);
    chain = result.then(() => undefined, () => undefined);
    return result;
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
