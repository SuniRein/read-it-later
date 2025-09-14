import type { I18nLocales } from '@/utils/i18n';
import type { FavoritedFilterOption, PageItem, Setting } from '@/utils/types';

import { storage } from '#imports';

function defaultLocale(): I18nLocales {
    const language = navigator.languages?.[0] ?? navigator.language ?? 'en';
    if (language.startsWith('zh')) {
        return 'zh_CN';
    }
    return 'en';
}

const defaultSetting: Setting = {
    pagination: 20,
    showBadge: false,
    faviconSource: 'favicon.im',
    locale: defaultLocale(),
    cloudStorage: null,
    webDavConfig: {},
    duplicatedUrlOpened: 'newTab',
} as const;

export default {
    pageList: storage.defineItem<PageItem[]>('local:pageList', { fallback: [] }),
    removedPageList: storage.defineItem<PageItem[]>('session:removedPageList', { fallback: [] }),
    forvoritedFilterOption: storage.defineItem<FavoritedFilterOption>('session:favoritedFilterOption', {
        fallback: 'all',
    }),
    searchText: storage.defineItem<string>('session:searchText', { fallback: '' }),
    setting: storage.defineItem<Setting>('local:setting', { fallback: defaultSetting }),
};
