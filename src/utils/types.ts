import { type Browser } from '#imports';

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
    showPageCount: boolean;
    faviconSource: FaviconSource;
}

export type FaviconSource = 'favicon.im' | 'google' | 'duckduckgo';
