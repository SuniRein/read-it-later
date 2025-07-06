<script lang="ts" setup>
import { browser } from '#imports';
import { ref, computed, onMounted } from 'vue';

import { Pagination, Layout, LayoutHeader, LayoutContent, LayoutFooter, message } from 'ant-design-vue';
import TopOperation from './TopOperation.vue';
import PageList from './PageList.vue';

import type { PageItem, PageInfo, Tab } from '@/utils/types';
import { onMessage } from '@/utils/message';
import { usePageList } from '@/composables/page-list';
import { useFavoritedFilterOption } from '@/composables/favorited-filter-option';

const current = ref(1);
const pageSize = ref(5);

const { favoritedFilterOption, change: changeFavoritedView } = useFavoritedFilterOption();

function favoritedFilter(item: PageItem): boolean {
    if (favoritedFilterOption.value === 'all') return true;
    return favoritedFilterOption.value === 'favorited' ? item.favorited : !item.favorited;
}

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

const currentTab = ref<Tab | null>(null);
onMounted(async () => {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    currentTab.value = tabs[0] ?? null;
});
onMessage('currentTabChanged', ({ data: { tab } }) => {
    currentTab.value = tab;
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
