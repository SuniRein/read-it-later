import type { PageItem } from '@/common/types';

export interface PageUpdateInfo {
  title?: string;
  tags?: string[];
  desc?: string;
}

export interface PageLoadResult {
  added: PageItem[];
  updated: PageItem[];
  ignored: PageItem[];
  conflicted: PageItem[];
}
