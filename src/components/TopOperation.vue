<script setup lang="ts">
import { Input } from 'ant-design-vue';
import {
    SettingOutlined,
    SyncOutlined,
    StarOutlined,
    ThunderboltOutlined,
    PlusCircleOutlined,
} from '@ant-design/icons-vue';

import IconButton from './IconButton.vue';

import type { PageInfo } from '@/utils/types';
import { sendMessage } from '@/utils/message';

const emit = defineEmits<{
    (e: 'add-page', info: PageInfo): void;
}>();

async function addNewPage() {
    const tab = await sendMessage('getActiveTab');
    const info = {
        title: tab.title ?? 'Title Not Available',
        url: tab.url ?? 'Url Not Available',
        faviconUrl: tab.favIconUrl,
    };
    emit('add-page', info);
}
</script>

<template>
    <div class="top-operation">
        <IconButton :icon="SettingOutlined" tip="Open setting page" />
        <IconButton :icon="SyncOutlined" tip="Sync" />

        <Input allowClear placeholder="Find..." />

        <IconButton :icon="StarOutlined" tip="Filter by 'favorite' status" />
        <IconButton :icon="ThunderboltOutlined" tip="Open a random page" />
        <IconButton :icon="PlusCircleOutlined" tip="Add current page to list" @click="addNewPage" />
    </div>
</template>

<style scoped>
.top-operation {
    display: flex;
    align-items: center;
    gap: 0.8rem;

    height: 100%;
    padding: 0 0.5rem;
    margin: 0;
}
</style>
