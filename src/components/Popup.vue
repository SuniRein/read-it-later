<script lang="ts" setup>
import { ref, computed } from 'vue';

import { Pagination, Layout, LayoutHeader, LayoutContent, LayoutFooter } from 'ant-design-vue';
import TopOperation from './TopOperation.vue';
import PageList from './PageList.vue';

import { usePageList } from '@/utils/store';

const current = ref(1);
const pageSize = ref(5);

const pageListRef = usePageList();
const pageListDisplayed = computed(() => {
    const start = (current.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return pageListRef.value.slice(start, end);
});
</script>

<template>
    <Layout>
        <LayoutHeader style="height: 40px">
            <TopOperation v-model:pageList="pageListRef" />
        </LayoutHeader>

        <LayoutContent style="height: 420px; overflow-x: hidden; overflow-y: auto">
            <PageList :pageList="pageListDisplayed" />
        </LayoutContent>

        <LayoutFooter style="height: 40px; padding: 0 10px; text-align: center">
            <Pagination :total="pageListRef.length" v-model:current="current" v-model:pageSize="pageSize" />
        </LayoutFooter>
    </Layout>
</template>
