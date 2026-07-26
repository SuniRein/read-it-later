import type { BackgroundContext } from '../context';
import { onMessage } from '@/common/message';

export function installPageOpener(ctx: BackgroundContext): void {
  const { settings, pages, sendNotify } = ctx;
  const { duplicatedUrlOpened, openAndRemove, randomPageIgnoreOpened } = settings;
  const { pageMap, pageListFiltered, pageActions } = pages;

  ctx.openPage = async (url: string) => {
    const openedTabs = await browser.tabs.query({});
    const openedTab = openedTabs.find(tab => tab.url === url);

    if (!openedTab) {
      await browser.tabs.create({ url });
    }
    else {
      switch (duplicatedUrlOpened.value) {
        case 'ignore':
          break;

        case 'focus':
          await browser.tabs.update(openedTab.id, { active: true });
          break;

        case 'newTab':
          await browser.tabs.create({ url });
      }
    }

    if (openAndRemove.value) {
      const page = pageMap.value.get(url);
      if (page)
        pageActions.remove(page.id);
    }
  };

  onMessage('openPage', async ({ data: { url } }) => ctx.openPage(url));

  ctx.openRandomPage = async () => {
    let availablePages = pageListFiltered.value;

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
    await ctx.openPage(randomPage.info.url);
  };

  onMessage('openRandomPage', ctx.openRandomPage);
}
