import type { PageItem } from '@/common/types';
import { beforeEach, describe, expect, it } from 'vitest';
import { createStorageItems } from '@/storage';
import { migrateArchivedPageList } from '../migrations';

function createItem(id: string): PageItem {
  return {
    id,
    favorited: false,
    tags: [],
    desc: '',
    info: { title: `Page ${id}`, url: `https://example.com/${id}` },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  };
}

beforeEach(() => {
  fakeBrowser.reset();
});

describe('archived list migration', () => {
  it('merges session entries into local storage and removes the session key', async () => {
    const items = createStorageItems();
    const localItem = createItem('local');
    const sessionItem = createItem('session');
    const duplicate = createItem('duplicate');
    duplicate.info.url = localItem.info.url; // already archived under another id

    await items.archivedPageList.setValue([localItem]);
    await storage.setItem('session:removedPageList', [duplicate, sessionItem]);

    await migrateArchivedPageList(items);

    expect((await items.archivedPageList.getValue()).map(item => item.id))
      .toEqual(['local', 'session']);
    expect(await storage.getItem('session:removedPageList')).toBeNull();
  });

  it('leaves local storage untouched when there is no session data', async () => {
    const items = createStorageItems();
    const localItem = createItem('local');
    await items.archivedPageList.setValue([localItem]);

    await migrateArchivedPageList(items);

    expect((await items.archivedPageList.getValue()).map(item => item.id))
      .toEqual(['local']);
  });

  it('is idempotent when run twice', async () => {
    const items = createStorageItems();
    await storage.setItem('session:removedPageList', [createItem('session')]);

    await migrateArchivedPageList(items);
    await migrateArchivedPageList(items);

    expect((await items.archivedPageList.getValue()).map(item => item.id))
      .toEqual(['session']);
  });
});
