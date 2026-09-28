import type { SyncLogCallback } from '@/services/sync/types';
import type { StorageItems } from '@/storage';
import { useBoundStore } from '@/composables/stored-value';
import { createPageActions } from './mutations';

export function usePageList(
  items: Pick<StorageItems, 'pageList' | 'removedPageList'>,
  logOp?: SyncLogCallback,
) {
  const pageListStore = useBoundStore(items.pageList);
  const removedPageListStore = useBoundStore(items.removedPageList);
  const pageList = pageListStore.value;
  const removedPageList = removedPageListStore.value;
  const ready = Promise.all([pageListStore.ready, removedPageListStore.ready]).then(() => {});
  const actions = createPageActions(pageList, removedPageList, logOp);
  return { pageList, removedPageList, ready, ...actions };
}

export { usePageListContext } from './context';
export type { PageLoadResult, PageUpdateInfo } from './types';
