import type { MaybeRef } from 'vue';
import type { FavoritedFilterOption, PageItem } from '@/utils/types';

import { computed, unref } from 'vue';

function searchFilter(searchText: string) {
    return (item: PageItem): boolean => {
        if (searchText.length === 0)
            return true;
        return searchText.split(/\s+/).every((token) => {
            if (token.length === 0)
                return true;

            if (token.startsWith('#')) {
                const tag = token.slice(1).toLowerCase();
                return item.tags.some(t => t.toLowerCase() === tag);
            }

            const kw = token.toLowerCase();
            return item.info.title.toLowerCase().includes(kw) || item.info.url.toLowerCase().includes(kw);
        });
    };
}

function favoritedFilter(favoritedFilterOption: FavoritedFilterOption) {
    return (item: PageItem): boolean => {
        if (favoritedFilterOption === 'all')
            return true;
        return favoritedFilterOption === 'favorited' ? item.favorited : !item.favorited;
    };
}

export function usePageListFiltered(
    pageList: MaybeRef<PageItem[]>,
    favoritedFilterOption: MaybeRef<FavoritedFilterOption>,
    searchText: MaybeRef<string>,
) {
    return computed(() =>
        unref(pageList)
            .filter(favoritedFilter(unref(favoritedFilterOption)))
            .filter(searchFilter(unref(searchText))),
    );
}
