<script lang="ts" setup>
import { browser } from '#imports';
import { ref, computed } from 'vue';

import { Pagination, Layout, LayoutHeader, LayoutContent, LayoutFooter } from 'ant-design-vue';
import TopOperation from './TopOperation.vue';
import PageList from './PageList.vue';

import type { PageItem } from '@/utils/types';
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
    return pageListFiltered.value.slice(start, end);
});

function openUrl(url: string) {
    browser.tabs.create({ url });
}
</script>

<template>
    <Layout>
        <LayoutHeader style="height: 40px; padding: 0">
            <TopOperation
                :pageList="pageListFiltered"
                :favoritedFilterOption
                @add-page="add"
                @change-favorited-view="changeFavoritedView"
                @open-url="openUrl"
            />
        </LayoutHeader>

        <LayoutContent style="height: 420px; overflow-x: hidden; overflow-y: auto">
            <PageList
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
