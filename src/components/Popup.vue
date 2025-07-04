<script lang="ts" setup>
import { ref, h } from 'vue';

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

const title = ref<string>('');
const url = ref<string>('');

async function getInfo() {
    const tab = await sendMessage('getActiveTab');
    const pageInfo = await sendMessage('getPageInfo', { tab });
    title.value = pageInfo.title;
    url.value = pageInfo.url;
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

    <div class="page-info">
        <p>Title: {{ title }}</p>
        <p>URL: {{ url }}</p>
    </div>
</template>
