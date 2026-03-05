import type { I18nLocales } from '@/utils/i18n';

export type Tab = Browser.tabs.Tab;
/* eslint-disable style/operator-linebreak */
export type Command =
  | 'add-current-page'
  | 'open-popup'
  | 'open-random-page'
  | 'remove-current-page'
  | 'toggle-favorite-current-page';
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
  desc: string;
  createdAt: string;
  updatedAt: string;
}

export interface PageItemIMP {
  url: string;
  title: string;
  tags: string[];
}

export type FavoritedFilterOption = 'all' | 'favorited' | 'unfavorited';

export type CloudStorageType = 'webdav' | 'google-drive' | 'none';

export interface Setting {
  pagination: number;
  showBadge: boolean;

  faviconSource: FaviconSource;
  faviconCaching: boolean;

  locale: I18nLocales;

  cloudStorage: CloudStorageType;
  webDavConfig: WebDavConfig;
  googleDriveConfig: GoogleDriveConfig | null;

  duplicatedUrlOpened: DuplicatedUrlOpenedOption;
  openAndRemove: boolean;
}

export type FaviconSource = 'favicon.im' | 'google' | 'duckduckgo';

export interface WebDavConfig {
  url?: string;
  username?: string;
  password?: string;
}

export interface GoogleDriveConfig {
  email: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export type DuplicatedUrlOpenedOption = 'ignore' | 'focus' | 'newTab';
