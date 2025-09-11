import type { Ref } from 'vue';
import type { PageItem } from '@/utils/types';

import { browser } from '#imports';

export function handleOpenRandomPage(pageList: Ref<PageItem[]>) {
    return async () => {
        if (pageList.value.length === 0) {
            console.warn('No pages available to open.');
            return;
        }

        const randomIndex = Math.floor(Math.random() * pageList.value.length);
        const randomPage = pageList.value[randomIndex];
        await browser.tabs.create({ url: randomPage.info.url });
    };
}
