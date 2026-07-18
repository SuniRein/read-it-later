import type { StorageItems } from '@/storage';
import { useStoredValue } from '@/composables/stored-value';
import { createPageActions } from './mutations';

export function usePageList(items: Pick<StorageItems, 'pageList' | 'removedPageList'>) {
  const pageList = useStoredValue(items.pageList);
  const removedPageList = useStoredValue(items.removedPageList);
  const actions = createPageActions(pageList, removedPageList);
  return { pageList, removedPageList, ...actions };
}

export { usePageListContext } from './context';
export type { PageLoadResult, PageUpdateInfo } from './types';
