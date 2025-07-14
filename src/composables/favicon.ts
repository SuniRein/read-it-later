import { ref, onMounted } from 'vue';

import store from '@/utils/store';
import type { FaviconSource } from '@/utils/types';

export function useFavicon() {
    const faviconSource = ref<FaviconSource | undefined>(undefined);

    onMounted(async () => {
        faviconSource.value = (await store.setting.getValue()).faviconSource;
    });

    function getFaviconUrl(url: string): string | undefined {
        const parsedUrl = new URL(url);

        switch (faviconSource.value) {
            case 'favicon.im':
                return `https://favicon.im/${parsedUrl.hostname}?larger=true`;
            default:
                return undefined;
        }
    }

    return {
        getFaviconUrl,
    };
}
