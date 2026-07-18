import { useSettings } from '@/app/settings';
import { onMessage } from '@/common/message';
import { createStorageItems } from '@/storage';
import { handleAddCurrentTab } from './handlers/add-current-tab';
import { handleBadge } from './handlers/badge';
import { handleCache } from './handlers/cache';
import { handleCommand } from './handlers/command';
import { handleConnection } from './handlers/connect';
import { handleContextMenuClick, setupContextMenu } from './handlers/context-menu';
import { handleCurrentTab } from './handlers/current-tab';
import { handleSendNotify } from './handlers/notify';
import { handleOpenPage } from './handlers/open-page';
import { handlePageList } from './handlers/page-list';
import { handleOpenRandomPage } from './handlers/random-page';
import { handleUpdate } from './handlers/update';

const action = browser.action ?? browser.browserAction;

export default defineBackground(() => {
  const items = createStorageItems();

  browser.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === 'update') {
      await handleUpdate(items, details.previousVersion!);
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
  } = useSettings(items);

  // get the page list from storage
  const { pageMap, pageActions, pageListFiltered } = handlePageList(items);

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
