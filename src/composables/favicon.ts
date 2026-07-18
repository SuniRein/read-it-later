import type { StorageItems } from '@/storage';
import type { FaviconSource } from '@/utils/types';

export function useFavicon(items: Pick<StorageItems, 'setting'>) {
  const faviconSource = ref<FaviconSource | undefined>(undefined);

  onMounted(async () => {
    faviconSource.value = (await items.setting.getValue()).faviconSource;
  });

  function getFaviconUrl(url: string): string | undefined {
    const parsedUrl = new URL(url);

    switch (faviconSource.value) {
      case 'favicon.im':
        return `https://favicon.im/${parsedUrl.hostname}?larger=true`;
      case 'google':
        return `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}&sz=128`;
      case 'duckduckgo':
        return `https://icons.duckduckgo.com/ip3/${parsedUrl.hostname}.ico`;
      case undefined:
        return undefined;
    }
  }

  return {
    getFaviconUrl,
  };
}
