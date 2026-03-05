import type { NotifyFunction } from './notify';
import type { PageItem } from '@/utils/types';

export function handleOpenRandomPage(
  pageList: Ref<PageItem[]>,
  openPage: (url: string) => Promise<void>,
  randomPageIgnoreOpened: Ref<boolean>,
  sendNotify: NotifyFunction,
) {
  return async () => {
    let availablePages = pageList.value;

    if (randomPageIgnoreOpened.value) {
      const openedTabs = await browser.tabs.query({});
      const openedUrls = new Set(openedTabs.map(tab => tab.url));
      availablePages = availablePages.filter(page => !openedUrls.has(page.info.url));
    }

    if (availablePages.length === 0) {
      await sendNotify('warning', 'common.msg.openRandomPage.noPage');
      return;
    }

    const randomIndex = Math.floor(Math.random() * availablePages.length);
    const randomPage = availablePages[randomIndex];
    await openPage(randomPage.info.url);
  };
}
