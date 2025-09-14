import type { Ref } from 'vue';
import type { PageItem } from '@/utils/types';

import { browser } from '#imports';
import { computed, watchEffect } from 'vue';

const commonBadgeColor = '#444';
const activeBadgeColor = '#16a34a';
const favoritedBadgeColor = '#eab308';

const action = browser.action ?? browser.browserAction;

export function handleBadge(showBadge: Ref<boolean>, pageMap: Ref<Map<string, PageItem>>, currentTabUrl: Ref<string>) {
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

        const count = pageMap.value.size;
        action.setBadgeText({ text: count.toString() });
    }

    watchEffect(updateBadge);
}
