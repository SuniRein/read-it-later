import { storage } from '#imports';

import type { PageItem, FavoritedFilterOption, Setting } from '@/utils/types';

const defaultSetting: Setting = {
    pagination: 20,
} as const;

export default {
    pageList: storage.defineItem<PageItem[]>('local:pageList'),
    forvoritedFilterOption: storage.defineItem<FavoritedFilterOption>('local:favoritedFilterOption'),
    setting: storage.defineItem<Setting>('local:setting', { fallback: defaultSetting }),
};
