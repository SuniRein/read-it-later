<script lang="ts" setup>
import { ref, computed } from 'vue';

import { Flex, Input, Pagination, Layout, LayoutHeader, LayoutContent, LayoutFooter } from 'ant-design-vue';
import {
    SettingOutlined,
    SyncOutlined,
    StarOutlined,
    ThunderboltOutlined,
    PlusCircleOutlined,
} from '@ant-design/icons-vue';

import IconButton from './IconButton.vue';
import PageList from './PageList.vue';

import { sendMessage } from '@/utils/message';
import { usePageList } from '@/utils/store';
import { newPageItem } from '@/utils/page-item';

const current = ref(1);
const pageSize = ref(5);

const pageListRef = usePageList();
const pageListDisplayed = computed(() => {
    const start = (current.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return pageListRef.value.slice(start, end);
});

async function getInfo() {
    const tab = await sendMessage('getActiveTab');
    const info = {
        title: tab.title ?? 'Title Not Available',
        url: tab.url ?? 'Url Not Available',
        faviconUrl: tab.favIconUrl,
    };
    const item = newPageItem(info);
    pageListRef.value.push(item);
}
</script>

<template>
    <Layout>
        <LayoutHeader style="height: 40px">
            <Flex class="top-operation-header" justify="space-between">
                <IconButton :icon="SettingOutlined" tip="Open setting page" />
                <IconButton :icon="SyncOutlined" tip="Sync" />

                <Input allowClear placeholder="Find..." />

                <IconButton :icon="StarOutlined" tip="Filter by 'favorite' status" />
                <IconButton :icon="ThunderboltOutlined" tip="Open a random page" />
                <IconButton :icon="PlusCircleOutlined" tip="Add current page to list" @click="getInfo" />
            </Flex>
        </LayoutHeader>

        <LayoutContent style="height: 420px; overflow-x: hidden; overflow-y: auto">
            <PageList :pageList="pageListDisplayed" />
        </LayoutContent>

        <LayoutFooter style="height: 40px; padding: 0 10px; text-align: center">
            <Pagination :total="pageListRef.length" v-model:current="current" v-model:pageSize="pageSize" />
        </LayoutFooter>
    </Layout>
</template>
