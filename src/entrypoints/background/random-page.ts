import type { Ref } from 'vue';
import type { PageItem } from '@/utils/types';

export function handleOpenRandomPage(pageList: Ref<PageItem[]>, openPage: (url: string) => Promise<void>) {
  return async () => {
    if (pageList.value.length === 0) {
      console.warn('No pages available to open.');
      return;
    }

    const randomIndex = Math.floor(Math.random() * pageList.value.length);
    const randomPage = pageList.value[randomIndex];
    await openPage(randomPage.info.url);
  };
}
