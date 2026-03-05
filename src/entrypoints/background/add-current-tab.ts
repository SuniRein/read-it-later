import type { NotifyFunction } from './notify';
import type { PageInfo, Tab } from '@/utils/types';

export function handleAddCurrentTab(
  { currentTab, addPage, addAndClose, sendNotify }:
  {
    currentTab: Ref<Tab | null>;
    addPage: (info: PageInfo) => boolean;
    addAndClose: Ref<boolean>;
    sendNotify: NotifyFunction;
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
      if (success)
        await sendNotify('success', 'common.msg.addTab.success', undefined, true);
      else
        await sendNotify('error', 'common.msg.addTab.pageAlreadyExists');
    }
    catch (error) {
      console.error('Failed to send notify:', error);
    }

    if (success && addAndClose.value && tabId != null)
      await browser.tabs.remove(tabId);
  };
}
