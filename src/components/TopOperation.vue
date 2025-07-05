<script setup lang="ts">
import { Input, Badge } from 'ant-design-vue';
import {
    SettingOutlined,
    SyncOutlined,
    StarOutlined,
    ThunderboltOutlined,
    PlusCircleOutlined,
    CheckCircleFilled,
    CloseCircleFilled,
} from '@ant-design/icons-vue';

import IconButton from './IconButton.vue';

import type { PageInfo, FavoritedFilterOption } from '@/utils/types';
import { sendMessage } from '@/utils/message';

const { favoritedFilterOption } = defineProps<{
    favoritedFilterOption: FavoritedFilterOption;
}>();

const emit = defineEmits<{
    (e: 'add-page', info: PageInfo): void;
    (e: 'change-favorited-view'): void;
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

        <Badge :offset="[-8, 22]">
            <template #count>
                <CheckCircleFilled style="color: green" v-if="favoritedFilterOption === 'favorited'" />
                <CloseCircleFilled style="color: red" v-else-if="favoritedFilterOption === 'unfavorited'" />
                <div v-else><!-- Empty badge for 'all' option --></div>
            </template>
            <IconButton
                :icon="StarOutlined"
                tip="Filter by 'favorited' status"
                @click="emit('change-favorited-view')"
            />
        </Badge>
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
