import type { PageItem } from '@/common/types';
import type { StorageItems } from '@/storage';
import { IS_FIREFOX, urlRestricted } from '@/common/firefox';
import { useFavoritedFilterOption } from '@/composables/favorited-filter-option';
import { usePageList } from '@/composables/page-list';
import { usePageListFiltered } from '@/composables/page-list-filtered';
import { useSearchText } from '@/composables/search-text';

export interface PageListContextOptions {
  /**
   * Whether to exclude restricted URLs from pageListFiltered.
   */
  filterRestricted?: boolean;
}

export function usePageListContext(
  items: StorageItems,
  options: PageListContextOptions = {},
) {
  const { favoritedFilterOption, change: changeFavoritedView } = useFavoritedFilterOption(items);
  const { searchText, searchTextDebounced } = useSearchText(items);
  const { pageList, restorableItemCount, ...pageActions } = usePageList(items);

  // Whether to filter out restricted URLs from the page list.
  // By default, this is true for Firefox and false for other browsers.
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
    restorableItemCount,
    // filtered data
    pageListFiltered,
    // filter controls
    searchText,
    searchTextDebounced,
    favoritedFilterOption,
    changeFavoritedView,
    // page actions
    pageActions,
  };
}
