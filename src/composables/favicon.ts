import type { StorageItems } from '@/storage';
import { useSettings } from '@/app/settings';

export function useFavicon(items: Pick<StorageItems, 'setting'>) {
  const { faviconSource } = useSettings(items);

  function getFaviconUrl(url: string): string {
    const parsedUrl = new URL(url);

    switch (faviconSource.value) {
      case 'favicon.im':
        return `https://favicon.im/${parsedUrl.hostname}?larger=true`;
      case 'google':
        return `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}&sz=128`;
      case 'duckduckgo':
        return `https://icons.duckduckgo.com/ip3/${parsedUrl.hostname}.ico`;
    }
  }

  return { getFaviconUrl };
}
