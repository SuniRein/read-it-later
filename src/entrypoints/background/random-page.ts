import type { PageItem } from '@/utils/types';

export function handleOpenRandomPage(
  pageList: Ref<PageItem[]>,
  openPage: (url: string) => Promise<void>,
  randomPageIgnoreOpened: Ref<boolean>,
) {
  return async () => {
    let availablePages = pageList.value;

    if (randomPageIgnoreOpened.value) {
      const openedTabs = await browser.tabs.query({});
      const openedUrls = new Set(openedTabs.map(tab => tab.url));
      availablePages = availablePages.filter(page => !openedUrls.has(page.info.url));
    }

    if (availablePages.length === 0) {
      console.warn('No pages available to open.');
      return;
    }

    const randomIndex = Math.floor(Math.random() * availablePages.length);
    const randomPage = availablePages[randomIndex];
    await openPage(randomPage.info.url);
  };
}
