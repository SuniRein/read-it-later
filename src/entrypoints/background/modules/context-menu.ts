import type { BackgroundContext } from '../context';
import { CONTEXT_MENU_ID } from '../constants';

export function installContextMenu(ctx: BackgroundContext): void {
  async function setupContextMenu() {
    await browser.contextMenus.removeAll();

    browser.contextMenus.create({
      id: CONTEXT_MENU_ID,
      title: browser.i18n.getMessage('commandAddCurrentPage'),
      contexts: ['page'],
    });
  }

  browser.runtime.onInstalled.addListener(setupContextMenu);
  browser.runtime.onStartup.addListener(setupContextMenu); // firefox will lose context menu on restart

  browser.contextMenus.onClicked.addListener(async (info) => {
    if (info.menuItemId === CONTEXT_MENU_ID)
      await ctx.addCurrentTab();
  });
}
