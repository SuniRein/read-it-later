<script setup lang="ts">
import { Flex, Input } from 'ant-design-vue';
import {
    SettingOutlined,
    SyncOutlined,
    StarOutlined,
    ThunderboltOutlined,
    PlusCircleOutlined,
} from '@ant-design/icons-vue';

import IconButton from './IconButton.vue';

import type { PageItem } from '@/utils/types';
import { sendMessage } from '@/utils/message';
import { newPageItem } from '@/utils/page-item';

const pageList = defineModel<PageItem[]>('pageList', { required: true });

async function getInfo() {
    const tab = await sendMessage('getActiveTab');
    const info = {
        title: tab.title ?? 'Title Not Available',
        url: tab.url ?? 'Url Not Available',
        faviconUrl: tab.favIconUrl,
    };
    const item = newPageItem(info);
    pageList.value.push(item);
}
</script>

<template>
    <Flex class="top-operation" justify="space-between">
        <IconButton :icon="SettingOutlined" tip="Open setting page" />
        <IconButton :icon="SyncOutlined" tip="Sync" />

        <Input allowClear placeholder="Find..." />

        <IconButton :icon="StarOutlined" tip="Filter by 'favorite' status" />
        <IconButton :icon="ThunderboltOutlined" tip="Open a random page" />
        <IconButton :icon="PlusCircleOutlined" tip="Add current page to list" @click="getInfo" />
    </Flex>
</template>
