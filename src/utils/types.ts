import { type Browser } from '#imports';

export type Tab = Browser.tabs.Tab;

export interface PageInfo {
    title: string;
    url: string;
    faviconUrl?: string;
}

export interface PageItem {
    id: string;
    info: PageInfo;
    tags: string[];
    favorited: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type FavoritedFilterOption = 'all' | 'favorited' | 'unfavorited';
