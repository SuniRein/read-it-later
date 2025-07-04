<script lang="ts" setup>
import { h } from 'vue';

import { Flex, Input } from 'ant-design-vue';
import {
    SettingOutlined,
    SyncOutlined,
    StarOutlined,
    ThunderboltOutlined,
    PlusCircleOutlined,
} from '@ant-design/icons-vue';

import IconButton from './IconButton.vue';

import { sendMessage } from '@/utils/message';
import { usePageList } from '@/utils/store';

const pageListRef = usePageList();

async function getInfo() {
    const tab = await sendMessage('getActiveTab');
    const info = await sendMessage('getPageInfo', { tab });
    const page = { info, tags: [], favorited: false };
    pageListRef.value.push(page);
}
</script>

<template>
    <Flex class="top-operation-header" justify="space-between">
        <IconButton :icon="h(SettingOutlined)" tip="Open setting page" />
        <IconButton :icon="h(SyncOutlined)" tip="Sync" />

        <Input allowClear placeholder="Find..." />

        <IconButton :icon="h(StarOutlined)" tip="Filter by 'favorite' status" />
        <IconButton :icon="h(ThunderboltOutlined)" tip="Open a random page" />
        <IconButton :icon="h(PlusCircleOutlined)" tip="Add current page to list" @click="getInfo" />
    </Flex>

    <div v-if="pageListRef.length === 0">
        <p>No Page Available</p>
    </div>
    <div v-else class="page-info">
        <div v-for="{ info } in pageListRef">
            <p>Title: {{ info.title }}</p>
            <p>URL: {{ info.url }}</p>
            <p v-if="info.faviconUrl">Favicon: <img :src="info.faviconUrl" alt="Favicon" /></p>
        </div>
    </div>
</template>
