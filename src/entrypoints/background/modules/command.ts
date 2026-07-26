import type { BackgroundContext } from '../context';
import type { Command } from '@/common/types';
import { browserAction } from '../constants';

export function installCommand(ctx: BackgroundContext): void {
  const handlers: Record<Command, () => void> = {
    'add-current-page': ctx.addCurrentTab,
    'open-popup': () => { void browserAction().openPopup(); },
    'open-random-page': ctx.openRandomPage,
    'remove-current-page': ctx.removeCurrentPage,
    'toggle-favorite-current-page': ctx.toggleFavoriteCurrentPage,
  };

  browser.commands.onCommand.addListener((command: string) => {
    if (Object.hasOwn(handlers, command))
      handlers[command as Command]();
    else
      console.warn(`No handler for command: ${command}`);
  });
}
