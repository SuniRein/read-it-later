import type { BackgroundContext } from '../context';
import { onMessage } from '@/common/message';

export function installActivePageActions(ctx: BackgroundContext): void {
  const { currentTab, settings, pages, sendNotify } = ctx;
  const { addAndClose } = settings;
  const { pageMap, pageActions } = pages;

  ctx.addCurrentTab = async () => {
    if (currentTab.value === null)
      throw new Error('No active tab');

    const { url, title, id: tabId } = currentTab.value;

    const success = pageActions.add({
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

  onMessage('addCurrentTab', ctx.addCurrentTab);

  ctx.removeCurrentPage = () => {
    const id = pageMap.value.get(ctx.currentTabUrl.value)?.id;
    if (id !== undefined)
      pageActions.remove(id);
  };

  ctx.toggleFavoriteCurrentPage = () => {
    const id = pageMap.value.get(ctx.currentTabUrl.value)?.id;
    if (id !== undefined)
      pageActions.toggleFavorite(id);
  };
}
