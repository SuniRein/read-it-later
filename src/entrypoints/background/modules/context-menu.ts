import type { BackgroundContext } from '../context';
import { CONTEXT_MENU_ID } from '../constants';

export function installContextMenu(ctx: BackgroundContext): void {
  const { settings } = ctx;

  let pending = Promise.resolve();

  async function setupContextMenu(): Promise<void> {
    await settings.ready;
    await browser.contextMenus.removeAll();

    if (!settings.showContextMenu.value)
      return;

    browser.contextMenus.create({
      id: CONTEXT_MENU_ID,
      title: browser.i18n.getMessage('commandAddCurrentPage'),
      contexts: ['page'],
    });
  }

  function scheduleSetup(): void {
    pending = pending
      .then(setupContextMenu)
      .catch(error => console.error('Failed to update context menu:', error));
  }

  browser.runtime.onInstalled.addListener(scheduleSetup);
  browser.runtime.onStartup.addListener(scheduleSetup); // firefox will lose context menu on restart
  watch(settings.showContextMenu, scheduleSetup);

  browser.contextMenus.onClicked.addListener(async (info) => {
    if (info.menuItemId === CONTEXT_MENU_ID)
      await ctx.addCurrentTab();
  });
}
