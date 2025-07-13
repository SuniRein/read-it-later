import { defineBackground, browser } from '#imports';

import { sendMessage, onMessage } from '@/utils/message';
import store from '@/utils/store';

export default defineBackground(async () => {
    browser.tabs.onActivated.addListener(async (activeInfo) => {
        const tab = await browser.tabs.get(activeInfo.tabId);
        sendMessage('currentTabChanged', { tab });
    });

    browser.tabs.onUpdated.addListener(async (_tabId, _changeInfo, tab) => {
        if (tab.active) {
            sendMessage('currentTabChanged', { tab });
        }
    });

    const action = browser.action ?? browser.browserAction;
    action.setBadgeText({ text: (await store.pageList.getValue()).length.toString() });
    action.setBadgeBackgroundColor({ color: '#444' });

    onMessage('badgeUpdated', async ({ data: { count } }) => {
        action.setBadgeText({ text: count.toString() });
    });
});
