import { defineBackground, browser } from '#imports';

import { onMessage } from '@/utils/message';

export default defineBackground(() => {
    onMessage('getActiveTab', async () => {
        const tabs = await browser.tabs.query({ active: true, currentWindow: true });
        return tabs[0];
    });

    onMessage('getPageInfo', async ({ data: { tab } }) => {
        const title = tab.title ?? 'Title Not Available';
        const url = tab.url ?? 'URL Not Available';
        const faviconUrl = tab.favIconUrl;
        return { title, url, faviconUrl };
    });
});
