import { defineBackground, browser } from '#imports';

import { onMessage } from '@/utils/message';

export default defineBackground(() => {
    onMessage('getActiveTab', async () => {
        const tabs = await browser.tabs.query({ active: true, currentWindow: true });
        return tabs[0];
    });
});
