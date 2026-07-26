import type { BackgroundContext } from '../context';
import type { Tab } from '@/common/types';
import { onMessage, sendMessage } from '@/common/message';

export function installCurrentTab(ctx: BackgroundContext): void {
  const tab = shallowRef<Tab | null>(null);
  ctx.currentTab = tab;
  ctx.currentTabUrl = computed(() => tab.value?.url ?? '');
  ctx.currentTabId = computed(() => tab.value?.id ?? null);

  onMessage('getCurrentTab', async () => tab.value);

  async function isValidWindow(windowId: number) {
    const window = await browser.windows.get(windowId);
    return window.type === 'normal';
  }

  async function updateCurrentTab(newTab: Tab) {
    if (!(await isValidWindow(newTab.windowId)))
      return;

    tab.value = newTab;
    if (ctx.isConnected.value)
      await sendMessage('currentTabChanged', { tab: newTab });
  }

  browser.tabs.onActivated.addListener(async (activeInfo) => {
    const newTab = await browser.tabs.get(activeInfo.tabId);
    await updateCurrentTab(newTab);
  });

  browser.tabs.onUpdated.addListener(async (_tabId, _changeInfo, tab) => {
    if (tab.active)
      await updateCurrentTab(tab);
  });
}
