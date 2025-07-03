import { type Browser } from '#imports';

export type Tab = Browser.tabs.Tab;

export interface PageInfo {
    title: string;
    url: string;
}
