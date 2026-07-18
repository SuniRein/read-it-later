import type { StorageItems } from '@/storage';
import type { PageItem } from '@/utils/types';

import { useFavoritedFilterOption } from '@/composables/favorited-filter-option';
import { usePageList } from '@/composables/page-list';
import { usePageListFiltered } from '@/composables/page-list-filtered';
import { useSearchText } from '@/composables/search-text';

import { IS_FIREFOX, urlRestricted } from '@/utils/firefox';

export function handlePageList(items: StorageItems) {
  const { pageList, ...pageActions } = usePageList(items);

  const { searchTextDebounced } = useSearchText(items);
  const { favoritedFilterOption } = useFavoritedFilterOption(items);

  const clikablePageList = IS_FIREFOX
    ? computed(() => pageList.value.filter(item => !urlRestricted(item.info.url)))
    : pageList;
  const pageListFiltered = usePageListFiltered(clikablePageList, favoritedFilterOption, searchTextDebounced);

  const pageMap = computed(() => {
    const map = new Map<string, PageItem>();
    pageList.value.forEach(page => map.set(page.info.url, page));
    return map;
  });

  return { pageActions, pageListFiltered, pageMap };
}
