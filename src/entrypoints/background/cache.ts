import { onMessage } from '@/utils/message';

function createImageCache() {
    let imageCache: Cache | null = null;

    return {
        async get() {
            if (!imageCache) {
                imageCache = await caches.open('image-cache');
            }
            return imageCache;
        },
        async clear() {
            await caches.delete('image-cache');
            imageCache = null;
        },
    };
}

export async function handleCache() {
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

    onMessage('clearImageCache', async () => await imageCache.clear());
}
