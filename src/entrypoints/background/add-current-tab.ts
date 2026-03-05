import type { PageInfo, Tab } from '@/utils/types';
import { sendMessage } from '@/utils/message';

export function handleAddCurrentTab(
  currentTab: Ref<Tab | null>,
  addPage: (info: PageInfo) => boolean,
  isConnected: Ref<boolean>,
) {
  return async () => {
    if (currentTab.value === null)
      throw new Error('No active tab');

    const { url, title, id: tabId } = currentTab.value;

    const success = addPage({
      title: title ?? 'Title Not Available',
      url: url ?? 'Url Not Available',
    });

    if (isConnected.value)
      await sendMessage('addTabResult', { success });
    else if (tabId != null)
      await sendMessage('addTabResult', { success }, tabId);
  };
}
