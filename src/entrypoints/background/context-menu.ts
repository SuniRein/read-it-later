interface ContextMenuActions {
  addCurrentTab: () => Promise<void>;
}

export async function setupContextMenu({ addCurrentTab }: ContextMenuActions) {
  await browser.contextMenus.removeAll();

  browser.contextMenus.create({
    id: 'read-it-later-simply',
    title: browser.i18n.getMessage('commandAddCurrentPage'),
    contexts: ['page'],
  });
  browser.contextMenus.onClicked.addListener(addCurrentTab);
}
