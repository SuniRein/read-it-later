import type { FavoritedFilterOption, PageItem, Setting } from '@/utils/types';

import { storage } from '#imports';

const defaultSetting: Setting = {
    pagination: 20,
    showPageCount: false,
    faviconSource: 'favicon.im',
} as const;

export default {
    pageList: storage.defineItem<PageItem[]>('local:pageList', { fallback: [] }),
    forvoritedFilterOption: storage.defineItem<FavoritedFilterOption>('session:favoritedFilterOption', {
        fallback: 'all',
    }),
    searchText: storage.defineItem<string>('session:searchText', { fallback: '' }),
    setting: storage.defineItem<Setting>('local:setting', { fallback: defaultSetting }),
};
