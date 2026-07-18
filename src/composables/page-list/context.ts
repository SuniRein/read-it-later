import type { PageItem } from '@/common/types';
import type { StorageItems } from '@/storage';
import { IS_FIREFOX, urlRestricted } from '@/common/firefox';
import { useStoredValue } from '@/composables/stored-value';
import { usePageListFiltered } from './filters';
import { usePageList } from './index';

export function usePageListContext(
  items: StorageItems,
  options: { filterRestricted?: boolean } = {},
) {
  // --- filter controls ---
  const favoritedFilterOption = useStoredValue(items.favoritedFilterOption);

  function changeFavoritedView() {
    const current = favoritedFilterOption.value;
    favoritedFilterOption.value = (
      current === 'all'
        ? 'favorited'
        : current === 'favorited'
          ? 'unfavorited'
          : 'all'
    );
  }

  const searchText = useStoredValue(items.searchText);
  const searchTextDebounced = refDebounced(searchText, 300);

  const { pageList, removedPageList, ...actions } = usePageList(items);

  // --- derived ---
  const filterRestricted = options.filterRestricted ?? IS_FIREFOX;

  const baseList = computed<PageItem[]>(() =>
    filterRestricted
      ? pageList.value.filter(item => !urlRestricted(item.info.url))
      : pageList.value,
  );

  const pageListFiltered = usePageListFiltered(baseList, favoritedFilterOption, searchTextDebounced);

  const pageMap = computed(() => {
    const map = new Map<string, PageItem>();
    pageList.value.forEach(page => map.set(page.info.url, page));
    return map;
  });

  return {
    // raw (unfiltered) data
    pageList,
    pageMap,
    restorableItemCount: actions.restorableItemCount,
    // filtered data
    pageListFiltered,
    // filter controls
    searchText,
    searchTextDebounced,
    favoritedFilterOption,
    changeFavoritedView,
    // page actions
    pageActions: actions,
  };
}
