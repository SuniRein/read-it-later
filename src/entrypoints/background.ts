import type { Browser } from '#imports';

import { browser, defineBackground } from '#imports';

import { computed, shallowRef, watch } from 'vue';
import { sendMessage } from '@/utils/message';
import store from '@/utils/store';

const action = browser.action ?? browser.browserAction;

const commonBadgeColor = '#444';
const activeBadgeColor = '#16a34a';

export default defineBackground(() => {
    // connection with popup
    let popupPort: Browser.runtime.Port | null = null;

    browser.runtime.onConnect.addListener((port) => {
        if (port.name === 'popup-communication') {
            popupPort = port;
            port.onDisconnect.addListener(() => {
                popupPort = null;
            });
        }
    });

    // update current tab
    const currentTabUrl = shallowRef<string>('');

    async function updateCurrentTab(tab: Browser.tabs.Tab) {
        currentTabUrl.value = tab.url ?? '';
        if (popupPort)
            await sendMessage('currentTabChanged', { tab });
    }

    browser.tabs.onActivated.addListener(async (activeInfo) => {
        const tab = await browser.tabs.get(activeInfo.tabId);
        await updateCurrentTab(tab);
    });

    browser.tabs.onUpdated.addListener(async (_tabId, _changeInfo, tab) => {
        if (tab.active) {
            await updateCurrentTab(tab);
        }
    });

    // show badge with page count
    const showBadge = shallowRef(false);
    store.setting.getValue().then(setting => showBadge.value = setting.showPageCount);
    store.setting.watch(setting => showBadge.value = setting.showPageCount);

    const pageUrls = shallowRef<string[]>([]);
    store.pageList.getValue().then(pageList => pageUrls.value = pageList.map(item => item.info.url));
    store.pageList.watch(pageList => pageUrls.value = pageList.map(item => item.info.url));

    const currentTabActive = computed(() => pageUrls.value.includes(currentTabUrl.value));

    function updateBadge() {
        if (!showBadge.value) {
            action.setBadgeText({ text: '' });
            return;
        }

        const currentTabActive = pageUrls.value.includes(currentTabUrl.value);
        action.setBadgeBackgroundColor({
            color: currentTabActive ? activeBadgeColor : commonBadgeColor,
        });

        const count = pageUrls.value.length;
        action.setBadgeText({ text: count.toString() });
    }
    updateBadge();

    watch([showBadge, pageUrls, currentTabActive], updateBadge);
});
