import type { PageInfo, PageItem } from '@/utils/types';

import { fakeBrowser } from '#imports';
import { flushPromises } from '@vue/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';

import { usePageList } from '@/composables/page-list';
import store from '@/utils/store';

function createTestPageItem(id: string): PageItem {
    return {
        id,
        favorited: false,
        tags: ['tag1', 'tag2'],
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

async function setup() {
    await store.pageList.setValue(defaultPageList);
    const obj = usePageList();
    await flushPromises();
    return obj;
}

beforeEach(() => {
    fakeBrowser.reset();
});

it('initialization', async () => {
    const { pageList, restorableItemCount } = await setup();
    expect(pageList.value).toEqual(defaultPageList);
    expect(restorableItemCount.value).toBe(0);
});

describe('add a page', () => {
    it('successfully add a new page', async () => {
        const { pageList, add } = await setup();

        const newPage = createTestPageInfo('4');
        add(newPage);
        await flushPromises();

        expect(pageList.value).toHaveLength(4);
        expect(pageList.value[0].info).toEqual(newPage);

        const storedPageList = await store.pageList.getValue();
        expect(storedPageList).toEqual(pageList.value);
    });

    it('does not add a page with the same URL', async () => {
        const { pageList, add } = await setup();

        const duplicatePage = createTestPageInfo('1');
        add(duplicatePage);
        await flushPromises();

        expect(pageList.value).toHaveLength(3);

        const storedPageList = await store.pageList.getValue();
        expect(storedPageList).toEqual(pageList.value);
    });
});

it('successfully remove a page', async () => {
    const { pageList, restorableItemCount, remove } = await setup();

    const initialLength = pageList.value.length;
    remove('1');
    await flushPromises();

    expect(pageList.value).toHaveLength(initialLength - 1);
    expect(pageList.value.some(item => item.id === '1')).toBe(false);
    expect(restorableItemCount.value).toBe(1);

    const storedPageList = await store.pageList.getValue();
    expect(storedPageList).toEqual(pageList.value);

    const storedRemovedList = await store.removedPageList.getValue();
    expect(storedRemovedList).toHaveLength(1);
    expect(storedRemovedList[0].id).toBe('1');
});

it('successfully update a page', async () => {
    const { pageList, update } = await setup();

    const newTitle = 'Updated Page Title';
    const newTags = ['updatedTag1', 'updatedTag2'];
    update('2', newTitle, newTags);
    await flushPromises();

    const updatedItem = pageList.value.find(item => item.id === '2');
    expect(updatedItem).toBeDefined();
    expect(updatedItem!.info.title).toBe(newTitle);
    expect(updatedItem!.tags).toEqual(newTags);
    expect(updatedItem!.updatedAt).not.toBe('2023-01-01T00:00:00Z');

    const storedPageList = await store.pageList.getValue();
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

    const storedPageList = await store.pageList.getValue();
    expect(storedPageList).toEqual(pageList.value);
});

describe('loading pages', () => {
    it('load new pages', async () => {
        const { pageList, load } = await setup();

        const newPages = [
            createTestPageItem('4'),
            createTestPageItem('5'),
            createTestPageItem('6'),
        ];

        const addedCount = load(newPages);
        await flushPromises();

        expect(addedCount).toBe(3);
        expect(pageList.value).toHaveLength(6);
        expect(pageList.value.map(item => item.id).slice(0, 3)).toEqual(['4', '5', '6']);

        const storedPageList = await store.pageList.getValue();
        expect(storedPageList).toEqual(pageList.value);
    });

    it('do not load existing pages', async () => {
        const { pageList, load } = await setup();

        const existingPage = createTestPageItem('1');
        const newPages = [
            existingPage,
            createTestPageItem('4'),
        ];

        const addedCount = load(newPages);
        await flushPromises();

        expect(addedCount).toBe(1);
        expect(pageList.value).toHaveLength(4);
        expect(pageList.value[0].id).toBe('4');

        const storedPageList = await store.pageList.getValue();
        expect(storedPageList).toEqual(pageList.value);
    });
});

describe('restoring pages', () => {
    it('restore a removed page', async () => {
        const { pageList, restorableItemCount, remove, restoreRemoved } = await setup();

        // remove a page to set up the test
        remove('1');
        await flushPromises();

        restoreRemoved();
        await flushPromises();

        expect(pageList.value).toHaveLength(3);
        expect(pageList.value.some(item => item.id === '1')).toBe(true);
        expect(restorableItemCount.value).toBe(0);

        const storedPageList = await store.pageList.getValue();
        expect(storedPageList).toEqual(pageList.value);
    });

    it('pages are restored in reverse order', async () => {
        const { pageList, restorableItemCount, remove, restoreRemoved } = await setup();

        // Remove multiple pages
        remove('1');
        remove('2');
        await flushPromises();

        // Restore the first removed page
        restoreRemoved();
        await flushPromises();

        expect(pageList.value).toHaveLength(2);
        expect(pageList.value[0].id).toBe('2');
        expect(restorableItemCount.value).toBe(1);

        // Retrieve the second removed page
        restoreRemoved();
        await flushPromises();

        expect(pageList.value).toHaveLength(3);
        expect(pageList.value[0].id).toBe('1');
        expect(restorableItemCount.value).toBe(0);

        const storedPageList = await store.pageList.getValue();
        expect(storedPageList).toEqual(pageList.value);

        const storedRemovedList = await store.removedPageList.getValue();
        expect(storedRemovedList).toHaveLength(0);
    });

    it('duplicate pages in removed list are cleared when adding a new page', async () => {
        const { pageList, restorableItemCount, add, remove, restoreRemoved } = await setup();

        remove('1');
        remove('2');
        await flushPromises();

        const newPage = createTestPageInfo('1');
        add(newPage);
        await flushPromises();

        expect(pageList.value).toHaveLength(2);
        expect(restorableItemCount.value).toBe(1);

        restoreRemoved();
        await flushPromises();

        expect(pageList.value).toHaveLength(3);
        expect(pageList.value[0].id).toBe('2');

        const storedPageList = await store.pageList.getValue();
        expect(storedPageList).toEqual(pageList.value);
    });
});
