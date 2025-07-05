import { defineExtensionMessaging } from '@webext-core/messaging';

import type { Tab } from '@/utils/types';

interface ProtocolMap {
    getActiveTab(): Promise<Tab>;
}

export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>();
