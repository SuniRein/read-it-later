import { storage } from '#imports';

import type { PageItem, FavoritedFilterOption } from '@/utils/types';

export default {
    pageList: storage.defineItem<PageItem[]>('local:pageList'),
    forvoritedFilterOption: storage.defineItem<FavoritedFilterOption>('local:favoritedFilterOption'),
};
