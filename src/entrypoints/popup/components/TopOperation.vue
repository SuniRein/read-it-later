<script setup lang="ts">
import type { FavoritedFilterOption, PageInfo, Tab } from '@/utils/types';

import {
  CheckCircleFilled,
  CloseCircleFilled,
  PlusCircleOutlined,
  SettingOutlined,
  StarOutlined,
  SyncOutlined,
  ThunderboltOutlined,
  UndoOutlined,
} from '@ant-design/icons-vue';
import { Badge } from 'ant-design-vue';

import useI18n from '@/composables/i18n';

import IconButton from './IconButton.vue';
import SearchBox from './SearchBox.vue';

const { currentTab, favoritedFilterOption, restorableItemCount } = defineProps<{
  currentTab: Tab | null;
  pageTags: string[];
  favoritedFilterOption: FavoritedFilterOption;
  restorableItemCount: number;
}>();

const emit = defineEmits<{
  (e: 'openSetting'): void;
  (e: 'addPage', info: PageInfo): void;
  (e: 'changeFavoritedView'): void;
  (e: 'openRandomPage'): void;
  (e: 'restoreRemovedPage'): void;
}>();

const searchText = defineModel<string>('searchText', { default: '' });

const { t } = useI18n();

function addNewPage() {
  if (currentTab) {
    const info: PageInfo = {
      title: currentTab.title ?? 'Title Not Available',
      url: currentTab.url ?? 'Url Not Available',
    };
    emit('addPage', info);
  }
}
</script>

<template>
  <div class="top-operation">
    <IconButton :icon="SettingOutlined" :tip="t('topTip.setting')" @click="emit('openSetting')" />

    <IconButton :icon="SyncOutlined" :tip="t('topTip.sync')" />

    <SearchBox v-model.trim="searchText" autofocus :tags="pageTags" />

    <Badge :offset="[-8, 22]">
      <template #count>
        <CheckCircleFilled v-if="favoritedFilterOption === 'favorited'" style="color: green" />
        <CloseCircleFilled v-else-if="favoritedFilterOption === 'unfavorited'" style="color: red" />
        <div v-else>
          <!-- Empty badge for 'all' option -->
        </div>
      </template>
      <IconButton :icon="StarOutlined" :tip="t('topTip.toggleFavorite')" @click="emit('changeFavoritedView')" />
    </Badge>

    <IconButton :icon="ThunderboltOutlined" :tip="t('topTip.random')" @click="emit('openRandomPage')" />

    <Badge :offset="[-8, 22]">
      <template #count>
        <span v-if="restorableItemCount !== 0" style="color: darksalmon">{{ restorableItemCount }}</span>
        <div v-else />
      </template>
      <IconButton :icon="UndoOutlined" :tip="t('topTip.restore')" :disabled="restorableItemCount === 0" @click="emit('restoreRemovedPage')" />
    </Badge>

    <IconButton :icon="PlusCircleOutlined" :tip="t('topTip.add')" @click="addNewPage" />
  </div>
</template>

<style scoped>
.top-operation {
  display: grid;
  grid-template-columns: repeat(2, 1fr) 10fr repeat(4, 1fr);
  align-items: center;
  gap: 0.2rem;

  height: 100%;
  padding: 0 0.25rem;
  margin: 0;
}
</style>
