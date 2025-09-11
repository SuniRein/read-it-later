import type { Ref } from 'vue';
import type { PageItem } from '@/utils/types';

import { browser } from '#imports';
import { computed, shallowRef, watchEffect } from 'vue';

import store from '@/utils/store';

const commonBadgeColor = '#444';
const activeBadgeColor = '#16a34a';
const favoritedBadgeColor = '#eab308';

const action = browser.action ?? browser.browserAction;

export function handleBadge(pageList: Ref<PageItem[]>, currentTabUrl: Ref<string>) {
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

    watchEffect(updateBadge);
}
