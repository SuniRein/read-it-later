import type { Browser } from '#imports';
import { browser, defineBackground } from '#imports';

import { sendMessage } from '@/utils/message';
import store from '@/utils/store';

const action = browser.action ?? browser.browserAction;

export default defineBackground(() => {
    let popupPort: Browser.runtime.Port | null = null;

    browser.runtime.onConnect.addListener((port) => {
        if (port.name === 'popup-communication') {
            popupPort = port;
            port.onDisconnect.addListener(() => {
                popupPort = null;
            });
        }
    });

    async function broadcastCurrentTab(tab: Browser.tabs.Tab) {
        if (!popupPort)
            return;
        await sendMessage('currentTabChanged', { tab });
    }

    browser.tabs.onActivated.addListener(async (activeInfo) => {
        const tab = await browser.tabs.get(activeInfo.tabId);
        await broadcastCurrentTab(tab);
    });

    browser.tabs.onUpdated.addListener(async (_tabId, _changeInfo, tab) => {
        if (tab.active) {
            await broadcastCurrentTab(tab);
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
    }
    else {
        action.setBadgeText({ text: '' });
    }
}
