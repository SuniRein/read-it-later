import type { Tab } from '@/utils/types';

import { defineExtensionMessaging } from '@webext-core/messaging';

interface ProtocolMap {
    currentTabChanged: (data: { tab: Tab }) => void;
    openRandomPage: () => void;
}

export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>();
