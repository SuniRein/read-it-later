import { nanoid } from 'nanoid';

import type { PageInfo } from '@/utils/types';
import store from '@/utils/store';
import { useStoredValue } from '@/composables/store';

export function usePageList() {
    const pageList = useStoredValue(store.pageList, []);

    function add(info: PageInfo) {
        const pageItem = {
            id: nanoid(),
            info,
            tags: [],
            favorited: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        pageList.value.push(pageItem);
    }

    return {
        pageList,
        add,
    };
}
