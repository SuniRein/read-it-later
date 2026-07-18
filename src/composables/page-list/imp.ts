import type { PageItem, PageItemIMP } from '@/common/types';
import { nanoid } from 'nanoid';

/**
 * Convert IMP-exported page items into the app's PageItem format.
 */
export function mapIMPToPageItems(data: PageItemIMP[]): PageItem[] {
  const now = new Date().toISOString();
  return data.map(item => ({
    id: nanoid(),
    info: { title: item.title, url: item.url },
    tags: item.tags,
    desc: '',
    favorited: false,
    createdAt: now, // NOTE: createdAt is intentionally set to `now` here.
    updatedAt: now,
  }));
}
