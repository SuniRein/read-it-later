import type { PageItem } from '@/utils/types';

import { type } from 'arktype';

const SerializedPageItem = type({
    id: 'string',
    info: {
        title: 'string',
        url: 'string',
        '+': 'delete',
    },
    tags: 'string[]',
    favorited: 'boolean',
    createdAt: 'string.date.iso',
    updatedAt: 'string.date.iso',
    '+': 'delete',
});

export function serializePageList(pageList: PageItem[]): string {
    return JSON.stringify(pageList);
}

export function deserializePageList(serializedList: string): PageItem[] {
    const raw = JSON.parse(serializedList);
    const parsedList = SerializedPageItem.array()(raw);
    if (parsedList instanceof type.errors) {
        throw new TypeError(`Invalid page list format: ${parsedList.summary}`);
    }
    return parsedList;
}
