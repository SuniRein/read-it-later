import { nanoid } from 'nanoid';

import type { PageInfo, PageItem } from '@/utils/types';

export function newPageItem(info: PageInfo): PageItem {
    return {
        id: nanoid(),
        info,
        tags: [],
        favorited: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
