import type { BackgroundContext } from '../context';
import { browserAction } from '../constants';

const commonBadgeColor = '#444';
const activeBadgeColor = '#16a34a';
const favoritedBadgeColor = '#eab308';

export function installBadge(ctx: BackgroundContext): void {
  const { showBadge } = ctx.settings;
  const { pageMap } = ctx.pages;
  const { currentTabUrl } = ctx;

  const pageCount = computed(() => pageMap.value.size);
  const currentTabActive = computed(() => pageMap.value.has(currentTabUrl.value));
  const currentTabFavorited = computed(() => pageMap.value.get(currentTabUrl.value)?.favorited ?? false);

  async function updateBadge() {
    const action = browserAction();
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
