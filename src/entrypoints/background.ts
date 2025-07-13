import { defineBackground, browser } from '#imports';

import { sendMessage } from '@/utils/message';
import store from '@/utils/store';

const action = browser.action ?? browser.browserAction;

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

    action.setBadgeBackgroundColor({ color: '#444' });
    updateBadgeText();

    store.setting.watch(updateBadgeText);
    store.pageList.watch(updateBadgeText);
});

async function updateBadgeText() {
    if ((await store.setting.getValue()).showPageCount) {
        const count = (await store.pageList.getValue()).length;
        action.setBadgeText({ text: count.toString() });
    } else {
        action.setBadgeText({ text: '' });
    }
}
