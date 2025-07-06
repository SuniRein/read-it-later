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

import type { PageInfo, PageItem, FavoritedFilterOption, Tab } from '@/utils/types';

const { currentTab, pageList, favoritedFilterOption } = defineProps<{
    currentTab: Tab | null;
    pageList: PageItem[];
    favoritedFilterOption: FavoritedFilterOption;
}>();

const emit = defineEmits<{
    (e: 'add-page', info: PageInfo): void;
    (e: 'change-favorited-view'): void;
    (e: 'open-url', url: string): void;
}>();

async function addNewPage() {
    if (currentTab) {
        const info = {
            title: currentTab.title ?? 'Title Not Available',
            url: currentTab.url ?? 'Url Not Available',
            faviconUrl: currentTab.favIconUrl,
        };
        emit('add-page', info);
    }
}

function openRandomPage() {
    const randomPage = pageList[Math.floor(Math.random() * pageList.length)];
    if (randomPage) {
        emit('open-url', randomPage.info.url);
    }
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
        <IconButton :icon="ThunderboltOutlined" tip="Open a random page" @click="openRandomPage" />
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
