<script lang="ts" setup>
import { browser } from '#imports';
import { ref, computed } from 'vue';

import { Pagination, Layout, LayoutHeader, LayoutContent, LayoutFooter, message } from 'ant-design-vue';
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

const { favoritedFilterOption, change: changeFavoritedView } = useFavoritedFilterOption();

function favoritedFilter(item: PageItem): boolean {
    if (favoritedFilterOption.value === 'all') return true;
    return favoritedFilterOption.value === 'favorited' ? item.favorited : !item.favorited;
}

const { currentTab } = useCurrentTab();

const { pageList, add, remove, update, toggleFavorite } = usePageList();
const pageListFiltered = computed(() => {
    return pageList.value.filter(favoritedFilter);
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
            <Pagination :total="pageListFiltered.length" v-model:current="current" v-model:pageSize="pageSize" />
        </LayoutFooter>
    </Layout>
</template>
