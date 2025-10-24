<script lang="ts" setup>
import type { PageInfo } from '@/utils/types';

import { browser } from '#imports';
import { Badge, Layout, LayoutContent, LayoutFooter, LayoutHeader, Pagination } from 'ant-design-vue';
import { computed, h, ref } from 'vue';

import { useCurrentTab } from '@/composables/current-tab';
import { useFavoritedFilterOption } from '@/composables/favorited-filter-option';
import useI18n from '@/composables/i18n';
import { usePageList } from '@/composables/page-list';
import { usePageListFiltered } from '@/composables/page-list-filtered';
import { useSearchText } from '@/composables/search-text';
import { useStoredValue } from '@/composables/store';
import { sendMessage } from '@/utils/message';
import notify from '@/utils/notify';

import store from '@/utils/store';
import PageList from './PageList.vue';
import TopOperation from './TopOperation.vue';

const { t } = useI18n();

const setting = useStoredValue(store.setting);
const faviconCaching = computed(() => setting.value.faviconCaching);

const current = ref(1);
const pageSize = computed(() => setting.value.pagination);

const { favoritedFilterOption, change: changeFavoritedView } = useFavoritedFilterOption();

const { searchText, searchTextDebounced } = useSearchText();

const { pageList, restorableItemCount, ...pageActions } = usePageList();
const pageListFiltered = usePageListFiltered(pageList, favoritedFilterOption, searchTextDebounced);

const { currentTab } = useCurrentTab();
const currentUrl = computed(() => currentTab.value?.url ?? null);

const pageListDisplayed = computed(() => {
    const start = (current.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    const paginated = pageListFiltered.value.slice(start, end);

    // make current page at the top if it exists
    const currentPage = pageList.value.find(item => item.info.url === currentUrl.value);
    if (currentPage) {
        return [currentPage, ...paginated.filter(item => item.info.url !== currentUrl.value)];
    }
    return paginated;
});

const pageTags = computed(() => {
    return Array.from(
        new Set(pageList.value.flatMap(item => item.tags)),
    );
});

function addPage(item: PageInfo) {
    if (!pageActions.add(item)) {
        notify.error(t('errorMsg.pageAlreadyExists'));
    }
}

function openUrl(url: string) {
    sendMessage('openPage', { url });
}

function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
}

function updateUrl(id: string, url: string) {
    if (!pageActions.updateUrl(id, url)) {
        notify.error(t('errorMsg.pageAlreadyExists'));
    }
}
</script>

<template>
    <Layout>
        <LayoutHeader style="height: 40px; padding: 0">
            <TopOperation
                v-model:search-text="searchText"
                :current-tab
                :page-tags
                :favorited-filter-option
                :restorable-item-count
                @add-page="addPage"
                @change-favorited-view="changeFavoritedView"
                @open-random-page="sendMessage('openRandomPage')"
                @open-setting="browser.runtime.openOptionsPage"
                @restore-removed-page="pageActions.restoreRemoved"
            />
        </LayoutHeader>

        <LayoutContent style="height: 420px; overflow-x: hidden; overflow-y: auto">
            <PageList
                :current-url
                :page-list="pageListDisplayed"
                :page-tags
                :favicon-caching
                @mark-read="pageActions.remove"
                @edit="pageActions.update"
                @toggle-star="pageActions.toggleFavorite"
                @open-url="openUrl"
                @copy-url="copyUrl"
                @update-url="updateUrl"
                @move-to-top="pageActions.moveToTop"
            />
        </LayoutContent>

        <LayoutFooter style="height: 40px; padding: 0 10px; text-align: center">
            <Pagination
                v-model:current="current"
                v-model:page-size="pageSize"
                :total="pageListFiltered.length"
                :show-total="(total) =>
                    h(Badge, {
                        count: total,
                        numberStyle: {
                            backgroundColor: '#52c41a',
                            boxShadow: '0 0 0 1px #d9d9d9 inset',
                        },
                        showZero: true,
                        overflowCount: 999,
                    })
                "
            />
        </LayoutFooter>
    </Layout>
</template>
