import { defineExtensionMessaging } from '@webext-core/messaging';

import type { Tab, PageInfo } from '@/utils/types';

interface ProtocolMap {
    getActiveTab(): Promise<Tab>;
    getPageInfo(data: { tab: Tab }): Promise<PageInfo>;
}

export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>();
