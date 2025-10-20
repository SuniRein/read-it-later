import type { Browser } from '#imports';
import type { I18nLocales } from '@/utils/i18n';

export type Tab = Browser.tabs.Tab;
/* eslint-disable style/operator-linebreak */
export type Command =
    | 'open-popup'
    | 'open-random-page'
    | 'remove-current-page';
/* eslint-enable style/operator-linebreak */

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

export type CloudStorageType = 'webdav' | null;

export interface Setting {
    pagination: number;
    showBadge: boolean;
    faviconSource: FaviconSource;
    faviconCaching: boolean;
    locale: I18nLocales;
    cloudStorage: CloudStorageType;
    webDavConfig: WebDavConfig;
    duplicatedUrlOpened: DuplicatedUrlOpenedOption;
}

export type FaviconSource = 'favicon.im' | 'google' | 'duckduckgo';

export interface WebDavConfig {
    url?: string;
    username?: string;
    password?: string;
}

export type DuplicatedUrlOpenedOption = 'ignore' | 'focus' | 'newTab';
