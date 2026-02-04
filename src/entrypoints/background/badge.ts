import type { PageItem } from '@/utils/types';

const commonBadgeColor = '#444';
const activeBadgeColor = '#16a34a';
const favoritedBadgeColor = '#eab308';

const action = browser.action ?? browser.browserAction;

export function handleBadge(showBadge: Ref<boolean>, pageMap: Ref<Map<string, PageItem>>, currentTabUrl: Ref<string>) {
  const pageCount = computed(() => pageMap.value.size);
  const currentTabActive = computed(() => pageMap.value.has(currentTabUrl.value));
  const currentTabFavorited = computed(() => pageMap.value.get(currentTabUrl.value)?.favorited ?? false);

  async function updateBadge() {
    if (!showBadge.value) {
      await action.setBadgeText({ text: '' });
      return;
    }

    await action.setBadgeBackgroundColor({
      color: currentTabActive.value
        ? (currentTabFavorited.value ? favoritedBadgeColor : activeBadgeColor)
        : commonBadgeColor,
    });
    await action.setBadgeText({ text: pageCount.value.toString() });
  }

  watch([showBadge, pageCount, currentTabActive, currentTabFavorited], updateBadge);
}
