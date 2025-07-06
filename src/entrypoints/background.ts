import { defineBackground, browser } from '#imports';

import { sendMessage } from '@/utils/message';

export default defineBackground(() => {
    browser.tabs.onActivated.addListener(async (activeInfo) => {
        const tab = await browser.tabs.get(activeInfo.tabId);
        sendMessage('currentTabChanged', { tab });
    });

    browser.tabs.onUpdated.addListener(async (_tabId, _changeInfo, tab) => {
        if (tab.active) {
            sendMessage('currentTabChanged', { tab });
        }
    });
});
