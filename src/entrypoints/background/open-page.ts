import type { Ref } from 'vue';
import type { DuplicatedUrlOpenedOption } from '@/utils/types';

import { browser } from '#imports';

export function handleOpenPage(option: Ref<DuplicatedUrlOpenedOption>) {
    return async (url: string) => {
        const openedTabs = await browser.tabs.query({});
        const openedTab = openedTabs.find(tab => tab.url === url);

        if (!openedTab) {
            await browser.tabs.create({ url });
            return;
        }

        switch (option.value) {
            case 'ignore': break;

            case 'focus':
                await browser.tabs.update(openedTab.id, { active: true });
                break;

            case 'newTab':
                await browser.tabs.create({ url });
        }
    };
}
