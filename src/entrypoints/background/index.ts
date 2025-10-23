import { browser, defineBackground } from '#imports';

import { onMessage } from '@/utils/message';

import { handleBadge } from './badge';
import { handleCache } from './cache';
import { handleCommand } from './command';
import { handleConnection } from './connect';
import { handleCurrentTab } from './current-tab';
import { handleOpenPage } from './open-page';
import { handlePageList } from './page-list';
import { handleOpenRandomPage } from './random-page';
import { handleSetting } from './setting';

const action = browser.action ?? browser.browserAction;

export default defineBackground(() => {
    // check if popup is connected
    const isConnected = handleConnection();

    // listen for current tab changes
    const currentTabUrl = handleCurrentTab(isConnected);

    // get setting from storage
    const { showBadge, duplicatedUrlOpened } = handleSetting();

    // get the page list from storage
    const { pageMap, pageActions, pageListFiltered } = handlePageList();

    // show and update the badge
    handleBadge(showBadge, pageMap, currentTabUrl);

    // open a page
    const openPage = handleOpenPage(duplicatedUrlOpened);
    onMessage('openPage', ({ data: { url } }) => openPage(url));

    // open a random page
    const openRandomPage = handleOpenRandomPage(pageListFiltered, openPage);
    onMessage('openRandomPage', openRandomPage);

    // handle browser keyboard commands
    handleCommand({
        'open-popup': action.openPopup,
        'open-random-page': openRandomPage,
        'remove-current-page': removeCurrentPage,
        'toggle-favorite-current-page': toggleFavoriteCurrentPage,
    });

    function removeCurrentPage() {
        const id = pageMap.value.get(currentTabUrl.value)?.id;
        if (id) {
            pageActions.remove(id);
        }
    }

    function toggleFavoriteCurrentPage() {
        const id = pageMap.value.get(currentTabUrl.value)?.id;
        if (id) {
            pageActions.toggleFavorite(id);
        }
    }

    // handle cache for fetched images
    handleCache();
});
