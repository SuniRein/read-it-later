import type { StorageItems } from '@/storage';
import { usePageListContext } from '@/composables/page-list-context';

export function handlePageList(items: StorageItems) {
  const ctx = usePageListContext(items);

  return {
    pageActions: ctx.pageActions,
    pageListFiltered: ctx.pageListFiltered,
    pageMap: ctx.pageMap,
  };
}
