import { nanoid } from 'nanoid';

import type { PageInfo } from '@/utils/types';
import store from '@/utils/store';
import { useStoredValue } from '@/composables/store';

export function usePageList() {
    const pageList = useStoredValue(store.pageList);

    function add(info: PageInfo): boolean {
        if (pageList.value.some((item) => item.info.url === info.url)) {
            return false; // Prevent adding duplicate pages
        }

        const pageItem = {
            id: nanoid(),
            info,
            tags: [],
            favorited: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        pageList.value.push(pageItem);
        return true;
    }

    function remove(id: string) {
        pageList.value = pageList.value.filter((item) => item.id !== id);
    }

    function update(id: string, newTitle: string, newTags: string[]) {
        const item = pageList.value.find((item) => item.id === id);
        if (item) {
            item.info.title = newTitle;
            item.tags = newTags;
            item.updatedAt = new Date();
        }
    }

    function toggleFavorite(id: string) {
        const item = pageList.value.find((item) => item.id === id);
        if (item) {
            item.favorited = !item.favorited;
            item.updatedAt = new Date();
        }
    }

    return {
        pageList,
        add,
        remove,
        update,
        toggleFavorite,
    };
}
