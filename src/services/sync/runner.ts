import type { SyncLogApi } from './log';
import type { PageItem } from '@/common/types';
import type { CloudService } from '@/services/cloud/types';
import type { StorageItems } from '@/storage';
import { deserializePageList, serializePageList } from '@/services/serialization';
import { replaySyncOps } from './replay';

export type SyncRunResult
  = | { status: 'synced' }
    | { status: 'skipped' }
    | { status: 'failed'; error: string };

/**
 * Pull the cloud sync file, replay local ops onto it, push the merge first,
 * then overwrite local state.
 */
export async function runSync(
  deps: { items: StorageItems; service: CloudService; syncLog: SyncLogApi },
  opts: { force?: boolean } = {},
): Promise<SyncRunResult> {
  const { items, service, syncLog } = deps;

  if (!(await service.preflight()))
    return { status: 'skipped' };

  try {
    const pageList = await items.pageList.getValue();
    const ops = await items.syncLog.getValue();

    if (opts.force !== true && ops.length === 0)
      return { status: 'skipped' }; // no local delta; manual sync passes force to pull anyway

    const syncFile = await service.findSyncFile();
    let merged: PageItem[] = [];
    if (syncFile) {
      const base = deserializePageList(await service.get(syncFile.id));
      merged = replaySyncOps(base, ops);
    }
    else {
      // First sync, or the cloud file was deleted (reset): upload the full local table.
      merged = pageList;
    }

    await service.saveSyncFile(serializePageList(merged));

    // Local items missing from the merge were deleted by this sync.
    const mergedIds = new Set(merged.map(m => m.id));
    const deleted = pageList.filter(p => !mergedIds.has(p.id));
    await items.pageList.setMeta({ lastModified: Date.now() });
    await items.pageList.setValue(merged);

    const removed = await items.removedPageList.getValue();
    await items.removedPageList.setMeta({ lastModified: Date.now() });
    await items.removedPageList.setValue([...removed, ...deleted]);

    await syncLog.clearPrefix(ops.length);

    await items.lastSyncFailed.setValue(false);
    return { status: 'synced' };
  }
  catch (error) {
    await items.lastSyncFailed.setValue(true);
    return { status: 'failed', error: error instanceof Error ? error.message : String(error) };
  }
}
