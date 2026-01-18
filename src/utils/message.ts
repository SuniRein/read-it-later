import type { Tab } from '@/utils/types';

import { defineExtensionMessaging } from '@webext-core/messaging';

interface ProtocolMap {
    currentTabChanged: (data: { tab: Tab }) => void;

    openRandomPage: () => void;
    openPage: (data: { url: string }) => void;

    fetchImageFromCache: (data: { url: string }) => string;
    clearImageCache: () => void;
}

// eslint-disable-next-line ts/unbound-method
export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>();
