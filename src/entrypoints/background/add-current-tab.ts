import type { PageInfo, Tab } from '@/utils/types';
import { sendMessage } from '@/utils/message';

export function handleAddCurrentTab(
  { currentTab, addPage, isConnected, addAndClose }:
  {
    currentTab: Ref<Tab | null>;
    addPage: (info: PageInfo) => boolean;
    isConnected: Ref<boolean>;
    addAndClose: Ref<boolean>;
  },
) {
  return async () => {
    if (currentTab.value === null)
      throw new Error('No active tab');

    const { url, title, id: tabId } = currentTab.value;

    const success = addPage({
      title: title ?? 'Title Not Available',
      url: url ?? 'Url Not Available',
    });

    try {
      if (isConnected.value)
        await sendMessage('addTabResult', { success });
      else if (tabId != null)
        await sendMessage('addTabResult', { success }, tabId);
    }
    catch (error) {
      console.error('Failed to send addTabResult message:', error);
    }

    if (success && addAndClose.value && tabId != null)
      await browser.tabs.remove(tabId);
  };
}
