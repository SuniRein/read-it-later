import { defineExtensionMessaging } from '@webext-core/messaging';

import type { Tab } from '@/utils/types';

interface ProtocolMap {
    currentTabChanged(data: { tab: Tab }): void;
}

export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>();
