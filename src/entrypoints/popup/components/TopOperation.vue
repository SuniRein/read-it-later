<script setup lang="ts">
import type { FavoritedFilterOption, PageInfo, Tab } from '@/utils/types';

import { CheckCircle2, PlusCircle, RefreshCw, Settings, Star, Undo2, XCircle, Zap } from 'lucide-vue-next';
import IconButton from './IconButton.vue';
import SearchBox from './SearchBox.vue';

const props = defineProps<{
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
  if (props.currentTab) {
    const info: PageInfo = {
      title: props.currentTab.title ?? 'Title Not Available',
      url: props.currentTab.url ?? 'Url Not Available',
    };
    emit('addPage', info);
  }
}
</script>

<template>
  <div class="flex items-center gap-2 border-b border-zinc-800 bg-zinc-950/90 px-1.5 py-1 shadow-sm backdrop-blur-md">
    <div class="flex items-center gap-1">
      <IconButton :icon="Settings" :tip="t('popup.tooltip.setting')" @click="emit('openSetting')" />
      <IconButton :icon="RefreshCw" :tip="t('popup.tooltip.sync')" />
    </div>

    <SearchBox v-model="searchText" autofocus :tags="pageTags" />

    <div class="flex items-center gap-1">
      <div class="relative flex items-center justify-center">
        <IconButton :icon="Star" :tip="t('popup.tooltip.toggleFavorite')" @click="emit('changeFavoritedView')" />
        <div v-if="favoritedFilterOption !== 'all'" class="pointer-events-none absolute -top-1 -right-1">
          <CheckCircle2
            v-if="favoritedFilterOption === 'favorited'" class="size-4 fill-emerald-500/20 text-emerald-500"
          />
          <XCircle v-else class="size-4 fill-red-500/20 text-red-500" />
        </div>
      </div>

      <IconButton :icon="Zap" :tip="t('popup.tooltip.random')" @click="emit('openRandomPage')" />

      <div class="relative flex items-center justify-center">
        <IconButton :icon="Undo2" :tip="t('popup.tooltip.restore')" :disabled="restorableItemCount === 0" @click="emit('restoreRemovedPage')" />
        <Badge
          v-if="restorableItemCount > 0"
          class="
            pointer-events-none absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center bg-orange-600 px-1
            text-[10px]
          "
        >
          {{ restorableItemCount }}
        </Badge>
      </div>
    </div>

    <div class="mx-1 h-4 w-px bg-zinc-600" />

    <IconButton
      :icon="PlusCircle"
      class="
        text-indigo-400
        hover:bg-indigo-500/20 hover:text-indigo-300
        active:scale-95
      "
      :tip="t('popup.tooltip.add')"
      @click="addNewPage"
    />
  </div>
</template>
