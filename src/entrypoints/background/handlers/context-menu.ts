const id = 'read-it-later-simply';

export async function setupContextMenu() {
  await browser.contextMenus.removeAll();

  browser.contextMenus.create({
    id,
    title: browser.i18n.getMessage('commandAddCurrentPage'),
    contexts: ['page'],
  });
}

interface ContextMenuActions {
  addCurrentTab: () => Promise<void>;
}

export function handleContextMenuClick({ addCurrentTab }: ContextMenuActions) {
  browser.contextMenus.onClicked.addListener(async (info) => {
    if (info.menuItemId === id) {
      await addCurrentTab();
    }
  });
}
