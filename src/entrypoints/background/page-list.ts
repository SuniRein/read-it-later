import type { PageItem } from '@/utils/types';

import { computed } from 'vue';

import { useFavoritedFilterOption } from '@/composables/favorited-filter-option';
import { usePageList } from '@/composables/page-list';
import { usePageListFiltered } from '@/composables/page-list-filtered';
import { useSearchText } from '@/composables/search-text';

import { isFirefox, urlRestricted } from '@/utils/firefox';

export function handlePageList() {
  const { pageList, ...pageActions } = usePageList();

  const { searchTextDebounced } = useSearchText();
  const { favoritedFilterOption } = useFavoritedFilterOption();

  const clikablePageList = computed(() =>
    isFirefox() ? pageList.value.filter(item => !urlRestricted(item.info.url)) : pageList.value,
  );
  const pageListFiltered = usePageListFiltered(clikablePageList, favoritedFilterOption, searchTextDebounced);

  const pageMap = computed(() => {
    const map = new Map<string, PageItem>();
    pageList.value.forEach(page => map.set(page.info.url, page));
    return map;
  });

  return { pageActions, pageListFiltered, pageMap };
}
