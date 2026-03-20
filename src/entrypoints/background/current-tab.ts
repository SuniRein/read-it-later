import type { Tab } from '@/utils/types';
import { onMessage, sendMessage } from '@/utils/message';

export function handleCurrentTab(isConnected: Ref<boolean>) {
  const tab = shallowRef<Tab | null>(null);

  onMessage('getCurrentTab', async () => tab.value);

  async function isValidWindow(windowId: number) {
    const window = await browser.windows.get(windowId);
    return window.type === 'normal';
  }

  async function updateCurrentTab(newTab: Tab) {
    if (!(await isValidWindow(newTab.windowId)))
      return;

    tab.value = newTab;
    if (isConnected.value)
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

  return tab;
}
