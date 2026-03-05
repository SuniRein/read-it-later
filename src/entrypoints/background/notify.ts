import type { I18nKey } from '@/composables/i18n';
import type { NotifyLevel } from '@/utils/notify';
import { sendMessage } from '@/utils/message';

export function handleSendNotify(
  isConnected: Ref<boolean>,
  currentTabId: Ref<number | null>,
) {
  return async (level: NotifyLevel, msg: I18nKey, args?: Record<string, unknown>, tabOnly: boolean = false) => {
    if (tabOnly && isConnected.value)
      return;

    if (isConnected.value)
      await sendMessage('notify', { level, msg, args });
    else if (currentTabId.value != null)
      await sendMessage('notify', { level, msg, args }, currentTabId.value);
  };
}

export type NotifyFunction = ReturnType<typeof handleSendNotify>;
