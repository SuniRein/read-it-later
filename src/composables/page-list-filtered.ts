import type { MaybeRef } from 'vue';
import type { FavoritedFilterOption, PageItem } from '@/utils/types';

import { computed, unref } from 'vue';

type Filter = (item: PageItem) => boolean;

function searchFilter(searchText: string): Filter {
  const tokens = searchText.split(/\s+/);

  function parseToken(token: string): Filter | null {
    if (token.startsWith('!')) {
      const innerToken = token.slice(1);
      const f = parseTokenWithoutNegation(innerToken);
      return f ? negateFilter(f) : null;
    }
    return parseTokenWithoutNegation(token);
  }

  function parseTokenWithoutNegation(token: string): Filter | null {
    if (token.length === 0)
      return null;

    if (token.startsWith('#')) {
      const tag = token.slice(1);
      return byTag(tag);
    }

    const kw = token.toLowerCase();
    return byKeyword(kw);
  }

  function negateFilter(f: Filter): Filter {
    return item => !f(item);
  }

  function byTag(tag: string): Filter | null {
    if (tag.length === 0)
      return null;
    return item => item.tags.includes(tag);
  }

  function byKeyword(kw: string): Filter {
    return item => item.info.title.toLowerCase().includes(kw) || item.info.url.toLowerCase().includes(kw);
  }

  const filters = tokens.map(parseToken).filter(fn => fn !== null);
  return item => filters.every(fn => fn(item));
}

function favoritedFilter(favoritedFilterOption: FavoritedFilterOption): Filter {
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
