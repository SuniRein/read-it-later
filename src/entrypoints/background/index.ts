import { browser, defineBackground } from '#imports';

import { onMessage } from '@/utils/message';

import { handleBadge } from './badge';
import { handleCommand } from './command';
import { handleConnection } from './connect';
import { handleCurrentTab } from './current-tab';
import { handlePageList } from './page-list';
import { handleOpenRandomPage } from './random-page';

const action = browser.action ?? browser.browserAction;

export default defineBackground(() => {
    // check if popup is connected
    const isConnected = handleConnection();

    // listen for current tab changes
    const currentTabUrl = handleCurrentTab(isConnected);

    // get the page list from storage
    const { pageList, pageListFiltered } = handlePageList();

    // show and update the badge
    handleBadge(pageList, currentTabUrl);

    // open a random page
    const openRandomPage = handleOpenRandomPage(pageListFiltered);
    onMessage('openRandomPage', openRandomPage);

    // handle browser keyboard commands
    handleCommand({
        'open-popup': action.openPopup,
        'open-random-page': openRandomPage,
    });
});
