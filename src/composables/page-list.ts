import { nanoid } from 'nanoid';

import type { PageInfo, PageItem } from '@/utils/types';
import store from '@/utils/store';
import { useStoredValue } from '@/composables/store';
import { sendMessage } from '@/utils/message';

export function usePageList() {
    const pageList = useStoredValue(store.pageList);

    function updateBadge() {
        sendMessage('badgeUpdated', { count: pageList.value.length });
    }

    function add(info: PageInfo): boolean {
        if (pageList.value.some((item) => item.info.url === info.url)) {
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
        pageList.value.push(pageItem);

        updateBadge();

        return true;
    }

    function remove(id: string) {
        pageList.value = pageList.value.filter((item) => item.id !== id);
        updateBadge();
    }

    function update(id: string, newTitle: string, newTags: string[]) {
        const item = pageList.value.find((item) => item.id === id);
        if (item) {
            item.info.title = newTitle;
            item.tags = newTags;
            item.updatedAt = new Date().toISOString();
        }
    }

    function toggleFavorite(id: string) {
        const item = pageList.value.find((item) => item.id === id);
        if (item) {
            item.favorited = !item.favorited;
            item.updatedAt = new Date().toISOString();
        }
    }

    function load(data: PageItem[]) {
        const existingIds = new Set(pageList.value.map((item) => item.id));
        const existingUrls = new Set(pageList.value.map((item) => item.info.url));

        const newItems = data.filter((item) => !existingIds.has(item.id) && !existingUrls.has(item.info.url));
        pageList.value.push(...newItems);

        updateBadge();
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
