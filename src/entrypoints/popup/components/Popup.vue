<script lang="ts" setup>
import type { PageInfo, PageItem } from '@/utils/types';

import { browser } from '#imports';
import { Badge, Layout, LayoutContent, LayoutFooter, LayoutHeader, message, Pagination } from 'ant-design-vue';
import { computed, h, ref } from 'vue';

import { useCurrentTab } from '@/composables/current-tab';
import { useFavoritedFilterOption } from '@/composables/favorited-filter-option';
import useI18n from '@/composables/i18n';
import { usePageList } from '@/composables/page-list';
import { useSearchText } from '@/composables/search-text';
import { useSetting } from '@/composables/setting';

import PageList from './PageList.vue';
import TopOperation from './TopOperation.vue';

const { t } = useI18n();

const { setting } = useSetting();

const current = ref(1);
const pageSize = computed(() => setting.value.pagination);

const { currentTab } = useCurrentTab();

const { favoritedFilterOption, change: changeFavoritedView } = useFavoritedFilterOption();

function favoritedFilter(item: PageItem): boolean {
    if (favoritedFilterOption.value === 'all')
        return true;
    return favoritedFilterOption.value === 'favorited' ? item.favorited : !item.favorited;
}

const { searchText } = useSearchText();

function searchFilter(item: PageItem): boolean {
    if (searchText.value.length === 0)
        return true;
    return searchText.value.split(/\s+/).every((token) => {
        if (token.length === 0)
            return true;

        if (token.startsWith('#')) {
            const tag = token.slice(1).toLowerCase();
            return item.tags.some(t => t.toLowerCase() === tag);
        }

        const kw = token.toLowerCase();
        return item.info.title.toLowerCase().includes(kw) || item.info.url.toLowerCase().includes(kw);
    });
}

const { pageList, add, remove, update, toggleFavorite, restorableItemCount, restoreRemoved } = usePageList();
const pageListFiltered = computed(() => {
    return pageList.value.filter(favoritedFilter).filter(searchFilter);
});
const pageListDisplayed = computed(() => {
    const start = (current.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    const paginated = pageListFiltered.value.slice(start, end);

    // make current page at the top if it exists
    const currentUrl = currentTab.value?.url;
    const currentPage = pageList.value.find(item => item.info.url === currentUrl);
    if (currentPage) {
        return [currentPage, ...paginated.filter(item => item.info.url !== currentUrl)];
    }
    return paginated;
});

function addPage(item: PageInfo) {
    if (!add(item)) {
        message.error({
            content: t('errorMsg.pageAlreadyExists'),
            duration: 1,
        });
    }
}

async function openUrl(url: string) {
    browser.tabs.create({ url });
}
</script>

<template>
    <Layout>
        <LayoutHeader style="height: 40px; padding: 0">
            <TopOperation
                v-model:search-text="searchText"
                :current-tab
                :page-list="pageListFiltered"
                :favorited-filter-option
                :restorable-item-count
                @add-page="addPage"
                @change-favorited-view="changeFavoritedView"
                @open-url="openUrl"
                @open-setting="browser.runtime.openOptionsPage"
                @restore-removed-page="restoreRemoved"
            />
        </LayoutHeader>

        <LayoutContent style="height: 420px; overflow-x: hidden; overflow-y: auto">
            <PageList
                :current-url="currentTab?.url ?? null"
                :page-list="pageListDisplayed"
                @mark-read="remove"
                @edit="update"
                @toggle-star="toggleFavorite"
                @open-url="openUrl"
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
