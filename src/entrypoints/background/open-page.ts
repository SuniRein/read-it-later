import type { DuplicatedUrlOpenedOption } from '@/utils/types';

export function handleOpenPage(
  { duplicatedUrlOpened, openAndRemove }: {
    duplicatedUrlOpened: Ref<DuplicatedUrlOpenedOption>;
    openAndRemove: Ref<boolean>;
  },
  pageMap: Ref<Map<string, { id: string }>>,
  removePage: (id: string) => void,
) {
  return async (url: string) => {
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
        removePage(page.id);
    }
  };
}
