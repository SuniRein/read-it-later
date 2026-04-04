import { onMessage } from '@/utils/message';

import { handleAddCurrentTab } from './add-current-tab';
import { handleBadge } from './badge';
import { handleCache } from './cache';
import { handleCommand } from './command';
import { handleConnection } from './connect';
import { handleContextMenuClick, setupContextMenu } from './context-menu';
import { handleCurrentTab } from './current-tab';
import { handleSendNotify } from './notify';
import { handleOpenPage } from './open-page';
import { handlePageList } from './page-list';
import { handleOpenRandomPage } from './random-page';
import { handleSetting } from './setting';
import { handleUpdate } from './update';

const action = browser.action ?? browser.browserAction;

export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === 'update') {
      await handleUpdate(details.previousVersion!);
    }
  });

  // check if popup is connected
  const isConnected = handleConnection();

  // listen for current tab changes
  const currentTab = handleCurrentTab(isConnected);
  const currentTabUrl = computed(() => currentTab.value?.url ?? '');
  const currentTabId = computed(() => currentTab.value?.id ?? null);

  // send notification to popup or current tab
  const sendNotify = handleSendNotify(isConnected, currentTabId);

  // get setting from storage
  const {
    showBadge,
    duplicatedUrlOpened,
    randomPageIgnoreOpened,
    openAndRemove,
    addAndClose,
  } = handleSetting();

  // get the page list from storage
  const { pageMap, pageActions, pageListFiltered } = handlePageList();

  // show and update the badge
  handleBadge(showBadge, pageMap, currentTabUrl);

  // open a page
  const openPage = handleOpenPage(
    { duplicatedUrlOpened, openAndRemove },
    pageMap,
    pageActions.remove,
  );
  onMessage('openPage', async ({ data: { url } }) => openPage(url));

  // open a random page
  const openRandomPage = handleOpenRandomPage(
    pageListFiltered,
    openPage,
    randomPageIgnoreOpened,
    sendNotify,
  );
  onMessage('openRandomPage', openRandomPage);

  // add or edit the current page
  const addCurrentTab = handleAddCurrentTab({
    currentTab,
    addPage: pageActions.add,
    addAndClose,
    sendNotify,
  });
  onMessage('addCurrentTab', addCurrentTab);

  // handle browser keyboard commands
  handleCommand({
    'add-current-page': addCurrentTab,
    'open-popup': action.openPopup,
    'open-random-page': openRandomPage,
    'remove-current-page': removeCurrentPage,
    'toggle-favorite-current-page': toggleFavoriteCurrentPage,
  });

  function removeCurrentPage() {
    const id = pageMap.value.get(currentTabUrl.value)?.id;
    if (id !== undefined) {
      pageActions.remove(id);
    }
  }

  function toggleFavoriteCurrentPage() {
    const id = pageMap.value.get(currentTabUrl.value)?.id;
    if (id !== undefined) {
      pageActions.toggleFavorite(id);
    }
  }

  // handle cache for fetched images
  void handleCache();

  // setup context menu
  browser.runtime.onInstalled.addListener(setupContextMenu);
  browser.runtime.onStartup.addListener(setupContextMenu); // firefox will lose context menu on restart

  handleContextMenuClick({ addCurrentTab });
});
