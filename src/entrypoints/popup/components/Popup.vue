<script lang="ts" setup>
import { browser } from '#imports';
import { ref, computed, h } from 'vue';

import { Pagination, Layout, LayoutHeader, LayoutContent, LayoutFooter, Badge, message } from 'ant-design-vue';
import TopOperation from './TopOperation.vue';
import PageList from './PageList.vue';

import type { PageItem, PageInfo } from '@/utils/types';
import { usePageList } from '@/composables/page-list';
import { useFavoritedFilterOption } from '@/composables/favorited-filter-option';
import { useCurrentTab } from '@/composables/current-tab';
import { useSetting } from '@/composables/setting';

const { setting } = useSetting();

const current = ref(1);
const pageSize = computed(() => setting.value.pagination);

const { currentTab } = useCurrentTab();

const { favoritedFilterOption, change: changeFavoritedView } = useFavoritedFilterOption();

function favoritedFilter(item: PageItem): boolean {
    if (favoritedFilterOption.value === 'all') return true;
    return favoritedFilterOption.value === 'favorited' ? item.favorited : !item.favorited;
}

const searchText = ref('');

function searchFilter(item: PageItem): boolean {
    if (searchText.value.length === 0) return true;
    return searchText.value.split(/\s+/).every((token) => {
        if (token.length === 0) return true;

        if (token.startsWith('#')) {
            const tag = token.slice(1).toLowerCase();
            return item.tags.some((t) => t.toLowerCase() === tag);
        }

        const kw = token.toLowerCase();
        return item.info.title.toLowerCase().includes(kw) || item.info.url.toLowerCase().includes(kw);
    });
}

const { pageList, add, remove, update, toggleFavorite } = usePageList();
const pageListFiltered = computed(() => {
    return pageList.value.filter(favoritedFilter).filter(searchFilter);
});
const pageListDisplayed = computed(() => {
    const start = (current.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    const paginated = pageListFiltered.value.slice(start, end);

    // make current page at the top if it exists
    const currentUrl = currentTab.value?.url;
    const currentPage = pageList.value.find((item) => item.info.url === currentUrl);
    if (currentPage) {
        return [currentPage, ...paginated.filter((item) => item.info.url !== currentUrl)];
    }
    return paginated;
});

function addPage(item: PageInfo) {
    if (!add(item)) {
        message.error({
            content: 'Page has already been in the page list.',
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
                :currentTab
                :pageList="pageListFiltered"
                :favoritedFilterOption
                @add-page="addPage"
                @change-favorited-view="changeFavoritedView"
                @open-url="openUrl"
                @open-setting="browser.runtime.openOptionsPage"
                v-model:searchText.trim="searchText"
            />
        </LayoutHeader>

        <LayoutContent style="height: 420px; overflow-x: hidden; overflow-y: auto">
            <PageList
                :currentUrl="currentTab?.url ?? null"
                :pageList="pageListDisplayed"
                @mark-read="remove"
                @edit="update"
                @toggle-star="toggleFavorite"
                @delete="remove"
                @open-url="openUrl"
            />
        </LayoutContent>

        <LayoutFooter style="height: 40px; padding: 0 10px; text-align: center">
            <Pagination
                :total="pageListFiltered.length"
                v-model:current="current"
                v-model:pageSize="pageSize"
                :show-total="
                    (total) =>
                        h(Badge, {
                            count: total,
                            numberStyle: {
                                backgroundColor: '#52c41a',
                                boxShadow: '0 0 0 1px #d9d9d9 inset',
                            },
                            showZero: true,
                        })
                "
            />
        </LayoutFooter>
    </Layout>
</template>
