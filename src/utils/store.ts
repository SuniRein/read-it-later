import { storage } from '#imports';

import type { PageItem, FavoritedFilterOption, Setting } from '@/utils/types';

const defaultSetting: Setting = {
    pagination: 20,
    showPageCount: false,
    faviconSource: 'favicon.im',
} as const;

export default {
    pageList: storage.defineItem<PageItem[]>('local:pageList', { fallback: [] }),
    forvoritedFilterOption: storage.defineItem<FavoritedFilterOption>('local:favoritedFilterOption', {
        fallback: 'all',
    }),
    setting: storage.defineItem<Setting>('local:setting', { fallback: defaultSetting }),
};
