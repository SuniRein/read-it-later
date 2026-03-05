import type { Tab } from '@/utils/types';
import { sendMessage } from '@/utils/message';

export function handleCurrentTab(isConnected: Ref<boolean>) {
  const tab = shallowRef<Tab | null>(null);

  async function updateCurrentTab(newTab: Tab) {
    tab.value = newTab;
    if (isConnected.value)
      await sendMessage('currentTabChanged', { tab: newTab });
  }

  browser.tabs.onActivated.addListener(async (activeInfo) => {
    const tab = await browser.tabs.get(activeInfo.tabId);
    await updateCurrentTab(tab);
  });

  browser.tabs.onUpdated.addListener(async (_tabId, _changeInfo, tab) => {
    if (tab.active)
      await updateCurrentTab(tab);
  });

  return tab;
}
