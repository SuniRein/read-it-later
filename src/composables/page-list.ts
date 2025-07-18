import type { PageInfo, PageItem } from '@/utils/types';

import { nanoid } from 'nanoid';

import { useStoredValue } from '@/composables/store';
import store from '@/utils/store';

export function usePageList() {
    const pageList = useStoredValue(store.pageList);

    function add(info: PageInfo): boolean {
        if (pageList.value.some(item => item.info.url === info.url)) {
            return false; // Prevent adding duplicate pages
        }

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

    return {
        pageList,
        add,
        remove,
        update,
        toggleFavorite,
        load,
    };
}
