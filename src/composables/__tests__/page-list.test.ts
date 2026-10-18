import type { PageInfo, PageItem } from '@/common/types';

import { flushPromises } from '@vue/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';

import { usePageList } from '@/composables/page-list';
import { createStorageItems, MAX_ARCHIVED_PAGES } from '@/storage';

function createTestPageItem(id: string): PageItem {
  return {
    id,
    favorited: false,
    tags: ['tag1', 'tag2'],
    desc: '',
    info: createTestPageInfo(id),
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  };
}

function createTestPageInfo(id: string): PageInfo {
  return {
    title: `Test Page ${id}`,
    url: `https://example.com/page/${id}`,
  };
}

const defaultPageList = [
  createTestPageItem('1'),
  createTestPageItem('2'),
  createTestPageItem('3'),
];

const items = createStorageItems();

async function setup() {
  await items.pageList.setValue(defaultPageList);
  const obj = usePageList(items);
  await flushPromises();
  return obj;
}

beforeEach(() => {
  fakeBrowser.reset();
});

it('initialization', async () => {
  const { pageList, archivedPageList } = await setup();
  expect(pageList.value).toEqual(defaultPageList);
  expect(archivedPageList.value).toEqual([]);
});

describe('add a page', () => {
  it('successfully add a new page', async () => {
    const { pageList, add } = await setup();

    const newPage = createTestPageInfo('4');
    add(newPage);
    await flushPromises();

    expect(pageList.value).toHaveLength(4);
    expect(pageList.value[0].info).toEqual(newPage);

    const storedPageList = await items.pageList.getValue();
    expect(storedPageList).toEqual(pageList.value);
  });

  it('does not add a page with the same URL', async () => {
    const { pageList, add } = await setup();

    const duplicatePage = createTestPageInfo('1');
    add(duplicatePage);
    await flushPromises();

    expect(pageList.value).toHaveLength(3);

    const storedPageList = await items.pageList.getValue();
    expect(storedPageList).toEqual(pageList.value);
  });
});

it('successfully remove a page', async () => {
  const { pageList, archivedPageList, remove } = await setup();

  const initialLength = pageList.value.length;
  remove('1');
  await flushPromises();

  expect(pageList.value).toHaveLength(initialLength - 1);
  expect(pageList.value.some(item => item.id === '1')).toBe(false);
  expect(archivedPageList.value.map(item => item.id)).toEqual(['1']);

  const storedPageList = await items.pageList.getValue();
  expect(storedPageList).toEqual(pageList.value);

  const storedArchivedList = await items.archivedPageList.getValue();
  expect(storedArchivedList).toHaveLength(1);
  expect(storedArchivedList[0].id).toBe('1');
});

it('successfully update a page', async () => {
  const { pageList, update } = await setup();

  const newInfo = {
    title: 'Updated Page Title',
    tags: ['updatedTag1', 'updatedTag2'],
    desc: 'This is an updated description.',
  };
  update('2', newInfo);
  await flushPromises();

  const updatedItem = pageList.value.find(item => item.id === '2');
  expect(updatedItem).toBeDefined();
  expect(updatedItem!.info.title).toBe(newInfo.title);
  expect(updatedItem!.tags).toEqual(newInfo.tags);
  expect(updatedItem!.desc).toBe(newInfo.desc);
  expect(updatedItem!.updatedAt).not.toBe('2023-01-01T00:00:00Z');

  const storedPageList = await items.pageList.getValue();
  expect(storedPageList).toEqual(pageList.value);
});

it('successfully toggle favorite status', async () => {
  const { pageList, toggleFavorite } = await setup();

  toggleFavorite('3');
  await flushPromises();

  const updatedItem = pageList.value.find(item => item.id === '3');
  expect(updatedItem).toBeDefined();
  expect(updatedItem!.favorited).toBe(true);
  expect(updatedItem!.updatedAt).not.toBe('2023-01-01T00:00:00Z');

  const storedPageList = await items.pageList.getValue();
  expect(storedPageList).toEqual(pageList.value);
});

describe('loading pages', () => {
  it('load new pages', async () => {
    const { pageList, tryLoad, load } = await setup();

    const newPages = [
      createTestPageItem('4'),
      createTestPageItem('5'),
      createTestPageItem('6'),
    ];

    const result = tryLoad(newPages);
    expect(result.added).toHaveLength(3);
    expect(result.updated).toHaveLength(0);
    expect(result.ignored).toHaveLength(0);
    expect(result.conflicted).toHaveLength(0);

    load(result);
    await flushPromises();
    expect(pageList.value).toHaveLength(6);
    expect(pageList.value.map(item => item.id).slice(0, 3)).toEqual(['4', '5', '6']);

    const storedPageList = await items.pageList.getValue();
    expect(storedPageList).toEqual(pageList.value);
  });

  it('do not load existing pages', async () => {
    const { pageList, tryLoad, load } = await setup();

    const existingPage = createTestPageItem('1');
    const newPages = [
      existingPage,
      createTestPageItem('4'),
    ];

    const result = tryLoad(newPages);
    expect(result.added).toHaveLength(1);
    expect(result.updated).toHaveLength(0);
    expect(result.ignored).toHaveLength(1);
    expect(result.conflicted).toHaveLength(0);

    load(result);
    await flushPromises();

    expect(pageList.value).toHaveLength(4);
    expect(pageList.value[0].id).toBe('4');

    const storedPageList = await items.pageList.getValue();
    expect(storedPageList).toEqual(pageList.value);
  });
});

describe('restoring archived pages', () => {
  it('restore an archived page', async () => {
    const { pageList, archivedPageList, remove, restoreArchivedPage } = await setup();

    // archive a page to set up the test
    remove('1');
    await flushPromises();

    expect(restoreArchivedPage('1')).toBe(true);
    await flushPromises();

    expect(pageList.value).toHaveLength(3);
    expect(pageList.value[0].id).toBe('1');
    expect(archivedPageList.value).toHaveLength(0);
    expect(await items.pageList.getValue()).toEqual(pageList.value);
    expect(await items.archivedPageList.getValue()).toEqual([]);
  });

  it('restores the requested page regardless of archive order', async () => {
    const { pageList, archivedPageList, remove, restoreArchivedPage } = await setup();

    remove('1');
    remove('2');
    await flushPromises();

    // restore the older archive entry first: no LIFO constraint
    expect(restoreArchivedPage('1')).toBe(true);
    await flushPromises();

    expect(pageList.value).toHaveLength(2);
    expect(pageList.value[0].id).toBe('1');
    expect(archivedPageList.value.map(item => item.id)).toEqual(['2']);

    expect(restoreArchivedPage('2')).toBe(true);
    await flushPromises();

    expect(pageList.value).toHaveLength(3);
    expect(pageList.value[0].id).toBe('2');
    expect(archivedPageList.value).toHaveLength(0);

    expect(await items.pageList.getValue()).toEqual(pageList.value);
    expect((await items.archivedPageList.getValue())).toEqual([]);
  });

  it('restoring an unknown id returns false and keeps state', async () => {
    const { pageList, archivedPageList, remove, restoreArchivedPage } = await setup();

    remove('1');
    await flushPromises();

    const pagesBefore = structuredClone(pageList.value);
    expect(restoreArchivedPage('does-not-exist')).toBe(false);
    await flushPromises();

    expect(pageList.value).toEqual(pagesBefore);
    expect(archivedPageList.value.map(item => item.id)).toEqual(['1']);
    expect((await items.archivedPageList.getValue()).map(item => item.id)).toEqual(['1']);
  });

  it('adding a page keeps its archived copies (append-only archive)', async () => {
    const { pageList, archivedPageList, add, remove, restoreArchivedPage } = await setup();

    remove('1');
    remove('2');
    await flushPromises();

    add(createTestPageInfo('1')); // re-added from the browser: new id, same url
    await flushPromises();

    expect(pageList.value).toHaveLength(2);
    expect(archivedPageList.value.map(item => item.id)).toEqual(['1', '2']);

    expect(restoreArchivedPage('2')).toBe(true);
    await flushPromises();

    expect(pageList.value).toHaveLength(3);
    expect(pageList.value[0].id).toBe('2');
    expect(archivedPageList.value.map(item => item.id)).toEqual(['1']);
    expect(await items.pageList.getValue()).toEqual(pageList.value);
  });

  it('keeping the existing page leaves the archive record intact', async () => {
    const { pageList, archivedPageList, add, remove, findArchivedConflict, restoreArchivedPage } = await setup();

    remove('1');
    await flushPromises();
    add({ title: 'Re-added', url: createTestPageInfo('1').url });
    await flushPromises();

    expect(findArchivedConflict('1')).toEqual(pageList.value[0]);
    const reAdded = structuredClone(pageList.value[0]);

    expect(restoreArchivedPage('1')).toBe(false);
    await flushPromises();

    expect(pageList.value).toHaveLength(3);
    expect(pageList.value).toContainEqual(reAdded);
    expect(archivedPageList.value.map(item => item.id)).toEqual(['1']);
    expect((await items.archivedPageList.getValue()).map(item => item.id)).toEqual(['1']);

    // The record survives, so it can still be restored once the conflict is gone.
    remove(reAdded.id);
    await flushPromises();
    expect(restoreArchivedPage('1')).toBe(true);
    await flushPromises();

    expect(pageList.value[0].id).toBe('1');
    expect(archivedPageList.value.map(item => item.id)).toEqual([reAdded.id]);
  });

  it('overwrite replaces the conflicting entry with the archived version', async () => {
    const { pageList, archivedPageList, add, remove, restoreArchivedPage } = await setup();

    remove('1');
    await flushPromises();
    add({ title: 'Re-added', url: createTestPageInfo('1').url });
    await flushPromises();

    expect(restoreArchivedPage('1', 'overwrite')).toBe(true);
    await flushPromises();

    const sameUrl = pageList.value.filter(item => item.info.url === createTestPageInfo('1').url);
    expect(sameUrl).toHaveLength(1);
    expect(sameUrl[0].id).toBe('1');
    expect(sameUrl[0].info.title).toBe('Test Page 1');
    expect(pageList.value).toHaveLength(3);
    expect(archivedPageList.value).toEqual([]);
    expect(await items.pageList.getValue()).toEqual(pageList.value);
  });
});

describe('archive capacity', () => {
  it('drops the oldest entries once MAX_ARCHIVED_PAGES is exceeded', async () => {
    await items.archivedPageList.setValue(
      Array.from({ length: MAX_ARCHIVED_PAGES }, (_, i) => createTestPageItem(`archived-${i}`)),
    );
    await items.pageList.setValue(defaultPageList);

    const { archivedPageList, remove } = usePageList(items);
    await flushPromises();

    remove('1');
    await flushPromises();

    expect(archivedPageList.value).toHaveLength(MAX_ARCHIVED_PAGES);
    expect(archivedPageList.value[0].id).toBe('archived-1');
    expect(archivedPageList.value.at(-1)?.id).toBe('1');
    expect(await items.archivedPageList.getValue()).toHaveLength(MAX_ARCHIVED_PAGES);
  });
});

describe('deleting archived pages', () => {
  it('deleteArchivedPage drops one entry and leaves the list untouched', async () => {
    const { pageList, archivedPageList, remove, deleteArchivedPage } = await setup();

    remove('1');
    remove('2');
    await flushPromises();

    const pagesBefore = structuredClone(pageList.value);
    deleteArchivedPage('1');
    await flushPromises();

    expect(archivedPageList.value.map(item => item.id)).toEqual(['2']);
    expect(pageList.value).toEqual(pagesBefore);
    expect((await items.archivedPageList.getValue()).map(item => item.id)).toEqual(['2']);
  });

  it('clearArchivedPages empties the archive and persists', async () => {
    const { pageList, archivedPageList, remove, clearArchivedPages } = await setup();

    remove('1');
    remove('2');
    await flushPromises();

    const pagesBefore = structuredClone(pageList.value);
    clearArchivedPages();
    await flushPromises();

    expect(archivedPageList.value).toEqual([]);
    expect(pageList.value).toEqual(pagesBefore);
    expect(await items.archivedPageList.getValue()).toEqual([]);
  });
});

describe('overwriting pages', () => {
  it('replaces the list, archives dropped items and persists both', async () => {
    const { pageList, archivedPageList, overwrite } = await setup();

    const next = [createTestPageItem('4'), createTestPageItem('2')];
    overwrite(next);
    await flushPromises();

    expect(pageList.value).toEqual(next);
    expect(archivedPageList.value.map(item => item.id)).toEqual(['3', '1']);
    expect(await items.pageList.getValue()).toEqual(next);
    expect((await items.archivedPageList.getValue()).map(item => item.id)).toEqual(['3', '1']);
  });
});
