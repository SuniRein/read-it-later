import type { Browser } from '#imports';
import type { I18nLocales } from '@/utils/i18n';

export type Tab = Browser.tabs.Tab;

export interface PageInfo {
    title: string;
    url: string;
}

export interface PageItem {
    id: string;
    info: PageInfo;
    tags: string[];
    favorited: boolean;
    createdAt: string;
    updatedAt: string;
}

export type FavoritedFilterOption = 'all' | 'favorited' | 'unfavorited';

export interface Setting {
    pagination: number;
    showBadge: boolean;
    faviconSource: FaviconSource;
    locale: I18nLocales;
}

export type FaviconSource = 'favicon.im' | 'google' | 'duckduckgo';
