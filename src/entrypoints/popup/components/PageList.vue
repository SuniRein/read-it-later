<script setup lang="ts">
import type { PageItem } from '@/common/types';
import type { PageUpdateInfo } from '@/composables/page-list';
import { PopupContextKey } from '@/common/symbols';
import PageEditSheet from './PageEditSheet.vue';
import PageListItem from './PageListItem.vue';

const ctx = inject(PopupContextKey)!;
const { displayedList, pageTags } = ctx;
const editedItem = ref<PageItem | null>(null);

function savePageEdit(info: PageUpdateInfo) {
  if (editedItem.value === null)
    return;
  ctx.pageActions.update(editedItem.value.id, info);
  editedItem.value = null;
}
</script>

<template>
  <div class="flex w-full flex-col">
    <div v-for="item in displayedList" :key="item.id" class="group relative">
      <PageListItem :item="item" @request-edit="editedItem = $event" />
    </div>

    <PageEditSheet v-model:item="editedItem" :tags="pageTags" @save="savePageEdit" />
  </div>
</template>
