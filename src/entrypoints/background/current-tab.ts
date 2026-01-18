import { sendMessage } from '@/utils/message';

export function handleCurrentTab(isConnected: Ref<boolean>) {
  const currentTabUrl = shallowRef<string>('');

  async function updateCurrentTab(tab: Browser.tabs.Tab) {
    currentTabUrl.value = tab.url ?? '';
    if (isConnected.value)
      await sendMessage('currentTabChanged', { tab });
  }

  browser.tabs.onActivated.addListener(async (activeInfo) => {
    const tab = await browser.tabs.get(activeInfo.tabId);
    await updateCurrentTab(tab);
  });

  browser.tabs.onUpdated.addListener(async (_tabId, _changeInfo, tab) => {
    if (tab.active)
      await updateCurrentTab(tab);
  });

  return currentTabUrl;
}
