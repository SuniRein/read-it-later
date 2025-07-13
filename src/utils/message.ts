import { defineExtensionMessaging } from '@webext-core/messaging';

import type { Tab } from '@/utils/types';

interface ProtocolMap {
    currentTabChanged(data: { tab: Tab }): void;
    badgeUpdated(data: { count: number }): void;
}

export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>();
