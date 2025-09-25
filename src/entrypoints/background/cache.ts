import { onMessage } from '@/utils/message';

export async function handleCache() {
    const cache = await globalThis.caches.open('image-cache');

    onMessage('fetchImageFromCache', async ({ data: { url } }) => {
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
}
