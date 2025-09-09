import type { Browser } from '#imports';
import type { Command, PageItem } from '@/utils/types';

import { browser, defineBackground } from '#imports';
import { computed, shallowRef, watch } from 'vue';

import { useFavoritedFilterOption } from '@/composables/favorited-filter-option';
import { usePageList } from '@/composables/page-list';
import { usePageListFiltered } from '@/composables/page-list-filtered';
import { useSearchText } from '@/composables/search-text';

import { isFirefox, urlRestricted } from '@/utils/firefox';
import { onMessage, sendMessage } from '@/utils/message';
import store from '@/utils/store';

const action = browser.action ?? browser.browserAction;

const commonBadgeColor = '#444';
const activeBadgeColor = '#16a34a';
const favoritedBadgeColor = '#eab308';

export default defineBackground(() => {
    const { pageList } = usePageList();
    const { searchText } = useSearchText();
    const { favoritedFilterOption } = useFavoritedFilterOption();

    const clikablePageList = computed(() =>
        isFirefox() ? pageList.value.filter(item => !urlRestricted(item.info.url)) : pageList.value,
    );
    const pageListFiltered = usePageListFiltered(clikablePageList, favoritedFilterOption, searchText);

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
    store.setting.getValue().then(setting => showBadge.value = setting.showBadge);
    store.setting.watch(setting => showBadge.value = setting.showBadge);

    const pageMap = computed(() => {
        const map = new Map<string, PageItem>();
        pageList.value.forEach(page => map.set(page.info.url, page));
        return map;
    });

    const currentTabActive = computed(() => pageMap.value.has(currentTabUrl.value));
    const currentTabFavorited = computed(() => pageMap.value.get(currentTabUrl.value)?.favorited ?? false);

    function updateBadge() {
        if (!showBadge.value) {
            action.setBadgeText({ text: '' });
            return;
        }

        action.setBadgeBackgroundColor({
            color: currentTabActive.value
                ? (currentTabFavorited.value ? favoritedBadgeColor : activeBadgeColor)
                : commonBadgeColor,
        });

        const count = pageList.value.length;
        action.setBadgeText({ text: count.toString() });
    }
    updateBadge();

    watch([showBadge, pageList, currentTabActive, currentTabFavorited], updateBadge);

    // open random page
    async function openRandomPage(pageList: PageItem[]) {
        if (pageList.length === 0) {
            console.warn('No pages available to open.');
            return;
        }

        const randomIndex = Math.floor(Math.random() * pageList.length);
        const randomPage = pageList[randomIndex];
        await browser.tabs.create({ url: randomPage.info.url });
    }

    onMessage('openRandomPage', () => openRandomPage(pageListFiltered.value));

    // listen for commands
    browser.commands.onCommand.addListener((command: string) => {
        switch (command as Command) {
            case 'open-popup':
                action.openPopup();
                break;

            case 'open-random-page':
                openRandomPage(pageListFiltered.value);
                break;

            default:
                console.warn(`Unknown command: ${command}`);
        }
    });
});
