import type { BackgroundContext } from '../context';
import type { NotifyLevel } from '@/common/notify';
import { sendMessage } from '@/common/message';

export type NotifyFunction = (level: NotifyLevel, msg: I18nKey, args?: Record<string, unknown>, tabOnly?: boolean) => Promise<void>;

export function installNotify(ctx: BackgroundContext): void {
  ctx.sendNotify = async (level, msg, args, tabOnly = false) => {
    if (tabOnly && ctx.isConnected.value)
      return;

    if (ctx.isConnected.value)
      await sendMessage('notify', { level, msg, args });
    else if (ctx.currentTabId.value != null)
      await sendMessage('notify', { level, msg, args }, ctx.currentTabId.value);
  };
}
