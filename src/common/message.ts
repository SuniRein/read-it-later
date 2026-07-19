import type { NotifyLevel } from '@/common/notify';
import type { Tab } from '@/common/types';
import { defineExtensionMessaging } from '@webext-core/messaging';
import notify from '@/common/notify';

interface ProtocolMap {
  getCurrentTab: () => Promise<Tab | null>;
  currentTabChanged: (data: { tab: Tab }) => void;

  openRandomPage: () => void;
  openPage: (data: { url: string }) => void;

  addCurrentTab: () => void;

  notify: (data: { level: NotifyLevel; msg: I18nKey; args?: Record<string, unknown> }) => void;

  fetchImageFromCache: (data: { url: string }) => string;
  clearImageCache: () => void;
}

// eslint-disable-next-line ts/unbound-method
export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>();

export function handleNotify(t: (key: I18nKey, args?: Record<string, unknown>) => string) {
  onMessage('notify', ({ data: { level, msg, args } }) => {
    notify[level](t(msg, args));
  });
}
