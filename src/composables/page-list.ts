import type { PageInfo, PageItem } from '@/utils/types';

import { nanoid } from 'nanoid';
import { computed } from 'vue';

import { useStoredValue } from '@/composables/store';
import store from '@/utils/store';

export function usePageList() {
    const pageList = useStoredValue(store.pageList);
    const removedPageList = useStoredValue(store.removedPageList);

    function add(info: PageInfo): boolean {
        if (pageList.value.some(item => item.info.url === info.url)) {
            return false; // Prevent adding duplicate pages
        }

        // Remove from removedPageList if it exists
        removedPageList.value = removedPageList.value.filter(item => item.info.url !== info.url);

        const now = new Date().toISOString();
        const pageItem = {
            id: nanoid(),
            info,
            tags: [],
            favorited: false,
            createdAt: now,
            updatedAt: now,
        };
        pageList.value.unshift(pageItem);
        return true;
    }

    function remove(id: string) {
        const item = pageList.value.find(item => item.id === id);
        if (item)
            removedPageList.value.push(item);

        pageList.value = pageList.value.filter(item => item.id !== id);
    }

    function update(id: string, newTitle: string, newTags: string[]) {
        const item = pageList.value.find(item => item.id === id);
        if (item) {
            item.info.title = newTitle;
            item.tags = newTags;
            item.updatedAt = new Date().toISOString();
        }
    }

    function toggleFavorite(id: string) {
        const item = pageList.value.find(item => item.id === id);
        if (item) {
            item.favorited = !item.favorited;
            item.updatedAt = new Date().toISOString();
        }
    }

    function load(data: PageItem[]) {
        const existingIds = new Set(pageList.value.map(item => item.id));
        const existingUrls = new Set(pageList.value.map(item => item.info.url));

        const newItems = data.filter(item => !existingIds.has(item.id) && !existingUrls.has(item.info.url));
        pageList.value.unshift(...newItems);
    }

    const restorableItemCount = computed(() => removedPageList.value.length);

    function restoreRemoved() {
        const restoredItem = removedPageList.value.pop();
        if (restoredItem) {
            pageList.value.unshift(restoredItem);
        }
    }

    return {
        pageList,
        add,
        remove,
        update,
        toggleFavorite,
        load,

        restorableItemCount,
        restoreRemoved,
    };
}
