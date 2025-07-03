<script lang="ts" setup>
import { ref, h } from 'vue';

import { Flex, Button, Input } from 'ant-design-vue';
import {
    SettingOutlined,
    SyncOutlined,
    StarOutlined,
    ThunderboltOutlined,
    PlusCircleOutlined,
} from '@ant-design/icons-vue';

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
        <Button type="ghost" ghost :icon="h(SettingOutlined)" />
        <Button type="ghost" ghost :icon="h(SyncOutlined)" />

        <Input allowClear placeholder="Find..." />

        <Button type="ghost" ghost :icon="h(StarOutlined)" />
        <Button type="ghost" ghost :icon="h(ThunderboltOutlined)" />
        <Button type="ghost" ghost :icon="h(PlusCircleOutlined)" @click="getInfo" />
    </Flex>

    <div class="page-info">
        <p>Title: {{ title }}</p>
        <p>URL: {{ url }}</p>
    </div>
</template>
