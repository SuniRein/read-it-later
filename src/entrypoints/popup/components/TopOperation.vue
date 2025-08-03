<script setup lang="ts">
import type { FavoritedFilterOption, PageInfo, PageItem, Tab } from '@/utils/types';

import {
    CheckCircleFilled,
    CloseCircleFilled,
    PlusCircleOutlined,
    SettingOutlined,
    StarOutlined,
    SyncOutlined,
    ThunderboltOutlined,
} from '@ant-design/icons-vue';
import { Badge } from 'ant-design-vue';

import IconButton from './IconButton.vue';
import SearchBox from './SearchBox.vue';

const { currentTab, pageList, favoritedFilterOption } = defineProps<{
    currentTab: Tab | null;
    pageList: PageItem[];
    favoritedFilterOption: FavoritedFilterOption;
}>();

const emit = defineEmits<{
    (e: 'openSetting'): void;
    (e: 'addPage', info: PageInfo): void;
    (e: 'changeFavoritedView'): void;
    (e: 'openUrl', url: string): void;
}>();

const searchText = defineModel<string>('searchText');

async function addNewPage() {
    if (currentTab) {
        const info: PageInfo = {
            title: currentTab.title ?? 'Title Not Available',
            url: currentTab.url ?? 'Url Not Available',
        };
        emit('addPage', info);
    }
}

function openRandomPage() {
    const randomPage = pageList[Math.floor(Math.random() * pageList.length)];
    if (randomPage) {
        emit('openUrl', randomPage.info.url);
    }
}
</script>

<template>
    <div class="top-operation">
        <IconButton :icon="SettingOutlined" tip="Open setting page" @click="emit('openSetting')" />
        <IconButton :icon="SyncOutlined" tip="Sync" />

        <SearchBox v-model:value="searchText" />

        <Badge :offset="[-8, 22]">
            <template #count>
                <CheckCircleFilled v-if="favoritedFilterOption === 'favorited'" style="color: green" />
                <CloseCircleFilled v-else-if="favoritedFilterOption === 'unfavorited'" style="color: red" />
                <div v-else>
                    <!-- Empty badge for 'all' option -->
                </div>
            </template>
            <IconButton :icon="StarOutlined" tip="Filter by 'favorited' status" @click="emit('changeFavoritedView')" />
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
