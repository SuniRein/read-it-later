import type { FavoritedFilterOption, PageItem } from '@/common/types';

type Filter = (item: PageItem) => boolean;

const whitespaceRegex = /\s+/;

export function searchFilter(searchText: string): Filter {
  const tokens = searchText.split(whitespaceRegex);

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

  const filters = tokens.map(parseToken).filter(fn => fn !== null);
  return item => filters.every(fn => fn(item));
}

export function favoritedFilter(option: FavoritedFilterOption): Filter {
  return (item: PageItem): boolean => {
    if (option === 'all')
      return true;
    return option === 'favorited' ? item.favorited : !item.favorited;
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
