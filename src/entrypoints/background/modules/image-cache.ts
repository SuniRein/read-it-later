import type { BackgroundContext } from '../context';
import { onMessage } from '@/common/message';
import { IMAGE_CACHE_NAME } from '../constants';

function createImageCache() {
  let imageCache: Cache | null = null;

  return {
    async get() {
      if (!imageCache)
        imageCache = await caches.open(IMAGE_CACHE_NAME);
      return imageCache;
    },
    async clear() {
      await caches.delete(IMAGE_CACHE_NAME);
      imageCache = null;
    },
  };
}

export function installImageCache(_ctx: BackgroundContext): void {
  const imageCache = createImageCache();

  onMessage('fetchImageFromCache', async ({ data: { url } }) => {
    const cache = await imageCache.get();

    let res = await cache.match(url);
    if (!res) {
      res = await fetch(url);
      await cache.put(url, res.clone());
    }

    const blob = await res.blob();
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
  });

  onMessage('clearImageCache', async () => imageCache.clear());
}
