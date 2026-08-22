<script setup lang="ts">
import { CheckCircle2, ExternalLink, Loader2, PlusCircle, RefreshCw, Settings, Star, Undo2, XCircle, Zap } from 'lucide-vue-next';
import { useSettings } from '@/app/settings';
import { addCurrentTab, openOptionsPage, openPopoutWindow, openRandomPage, syncNow } from '@/common/message-actions';
import notify from '@/common/notify';
import { PopupContextKey, StorageItemsKey } from '@/common/symbols';
import AutoComplete from '@/components/AutoComplete.vue';
import IconButton from './IconButton.vue';

const ctx = inject(PopupContextKey)!;
const { t } = useI18n();
const { searchText, favoritedFilterOption, restorableItemCount, changeFavoritedView, pageActions, pageTags, isPopout } = ctx;

async function popOut() {
  await openPopoutWindow();
  window.close();
}

const items = inject(StorageItemsKey)!;
const { cloudSyncEnabled } = useSettings();

const syncing = ref(false);
const pendingSyncCount = ref(0);
const lastSyncFailed = ref(false);

tryOnMounted(() => {
  void items.syncLog.getValue().then((log) => {
    pendingSyncCount.value = log.length;
  });
  items.syncLog.watch((log) => {
    pendingSyncCount.value = log.length;
  });
  void items.lastSyncFailed.getValue().then((v) => {
    lastSyncFailed.value = v;
  });
  items.lastSyncFailed.watch((v) => {
    lastSyncFailed.value = v;
  });
});

const syncIconClass = computed(() =>
  lastSyncFailed.value && !syncing.value
    ? 'text-red-400 hover:bg-red-500/20 hover:text-red-300'
    : undefined,
);

const syncTip = computed(() => {
  if (!cloudSyncEnabled.value)
    return t('popup.tooltip.syncDisabled');
  if (lastSyncFailed.value)
    return t('popup.tooltip.syncFailed');
  if (pendingSyncCount.value > 0)
    return t('popup.tooltip.syncPending', { count: pendingSyncCount.value });
  return t('popup.tooltip.sync');
});

async function handleSyncNow() {
  if (syncing.value)
    return;
  syncing.value = true;
  try {
    const result = await syncNow();
    if (result.status === 'synced')
      notify.success(t('option.data.sync.msg.synced'));
    else if (result.status === 'failed')
      notify.error(t('option.data.sync.msg.syncFailed', { error: result.error }));
    else
      notify.warning(t('option.data.sync.msg.unavailable'));
  }
  finally {
    syncing.value = false;
  }
}
</script>

<template>
  <div
    class="
      flex items-center gap-2 border-b border-sidebar-border bg-sidebar-primary px-1.5 py-1
      text-sidebar-primary-foreground shadow-sm
      dark:bg-sidebar dark:text-sidebar-foreground
    "
  >
    <div class="flex items-center gap-1">
      <IconButton :icon="Settings" :tip="t('popup.tooltip.setting')" @click="openOptionsPage()" />
      <IconButton :icon="ExternalLink" :tip="t('popup.tooltip.popout')" :disabled="isPopout" @click="popOut()" />
    </div>

    <AutoComplete
      v-model="searchText"
      root-class="w-full"
      class="bg-input text-primary"
      :candidates="pageTags"
      :delimiters="[' ']"
      :prefixes="['#', '!#']"
      :placeholder="t('popup.searchPlaceholder')"
      autofocus
    />

    <div class="flex items-center gap-1">
      <div v-if="cloudSyncEnabled" class="relative flex items-center justify-center">
        <IconButton
          :icon="syncing ? Loader2 : RefreshCw"
          :spin="syncing"
          :disabled="syncing"
          :class="syncIconClass"
          :tip="syncTip"
          @click="handleSyncNow"
        />
        <Badge
          v-if="pendingSyncCount > 0"
          class="
            pointer-events-none absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center bg-orange-400/20
            px-1 text-[10px] text-orange-400
          "
        >
          {{ pendingSyncCount > 99 ? '99+' : pendingSyncCount }}
        </Badge>
      </div>

      <div class="relative flex items-center justify-center">
        <IconButton :icon="Star" :tip="t('popup.tooltip.toggleFavorite')" @click="changeFavoritedView()" />
        <div v-if="favoritedFilterOption !== 'all'" class="pointer-events-none absolute -top-1 -right-1">
          <CheckCircle2
            v-if="favoritedFilterOption === 'favorited'" class="
              size-4 fill-emerald-500/20 text-emerald-500
              dark:fill-emerald-400/20 dark:text-emerald-400
            "
          />
          <XCircle
            v-else class="
              size-4 fill-red-500/20 text-red-500
              dark:fill-red-400/20 dark:text-red-400
            "
          />
        </div>
      </div>

      <IconButton :icon="Zap" :tip="t('popup.tooltip.random')" @click="openRandomPage()" />

      <div class="relative flex items-center justify-center">
        <IconButton :icon="Undo2" :tip="t('popup.tooltip.restore')" :disabled="restorableItemCount === 0" @click="pageActions.restoreRemoved()" />
        <Badge
          v-if="restorableItemCount > 0"
          class="
            pointer-events-none absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center bg-orange-400/20
            px-1 text-[10px] text-orange-400
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
      @click="addCurrentTab()"
    />
  </div>
</template>
