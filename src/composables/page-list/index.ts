import type { SyncLogCallback } from '@/services/sync/types';
import type { StorageItems } from '@/storage';
import { useBoundStore } from '@/composables/stored-value';
import { createPageActions } from './mutations';

export function usePageList(
  items: Pick<StorageItems, 'pageList' | 'archivedPageList'>,
  logOp?: SyncLogCallback,
) {
  const pageListStore = useBoundStore(items.pageList);
  const archivedPageListStore = useBoundStore(items.archivedPageList);
  const pageList = pageListStore.value;
  const archivedPageList = archivedPageListStore.value;
  const ready = Promise.all([pageListStore.ready, archivedPageListStore.ready]).then(() => {});
  const actions = createPageActions(pageList, archivedPageList, logOp);
  return { pageList, archivedPageList, ready, ...actions };
}

export { usePageListContext } from './context';
export type { PageLoadResult, PageUpdateInfo } from './types';
