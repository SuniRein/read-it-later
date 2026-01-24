<script lang="ts" setup>
import type { PageInfo } from '@/utils/types';

import { useCurrentTab } from '@/composables/current-tab';
import { useFavoritedFilterOption } from '@/composables/favorited-filter-option';
import { usePageList } from '@/composables/page-list';
import { usePageListFiltered } from '@/composables/page-list-filtered';
import { useSearchText } from '@/composables/search-text';
import { useStoredValue } from '@/composables/store';
import { sendMessage } from '@/utils/message';
import notify from '@/utils/notify';

import store from '@/utils/store';
import PageList from './PageList.vue';
import TopOperation from './TopOperation.vue';

const { t } = useI18n();

const setting = useStoredValue(store.setting);
const faviconCaching = computed(() => setting.value.faviconCaching);

const current = ref(1);
const pageSize = computed(() => setting.value.pagination);

const { favoritedFilterOption, change: changeFavoritedView } = useFavoritedFilterOption();

const { searchText, searchTextDebounced } = useSearchText();

const { pageList, restorableItemCount, ...pageActions } = usePageList();
const pageListFiltered = usePageListFiltered(pageList, favoritedFilterOption, searchTextDebounced);

const { currentTab } = useCurrentTab();
const currentUrl = computed(() => currentTab.value?.url ?? null);

const pageListDisplayed = computed(() => {
  const start = (current.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  const paginated = pageListFiltered.value.slice(start, end);

  // make current page at the top if it exists
  const currentPage = pageList.value.find(item => item.info.url === currentUrl.value);
  if (currentPage) {
    return [currentPage, ...paginated.filter(item => item.info.url !== currentUrl.value)];
  }
  return paginated;
});

const pageTags = computed(() => {
  return Array.from(
    new Set(pageList.value.flatMap(item => item.tags)),
  );
});

function addPage(item: PageInfo) {
  if (!pageActions.add(item)) {
    notify.error(t('popup.msg.pageAlreadyExists'));
  }
}

async function openUrl(url: string) {
  await sendMessage('openPage', { url });
}

async function copyUrl(url: string) {
  await navigator.clipboard.writeText(url);
}

function updateUrl(id: string, url: string) {
  if (!pageActions.updateUrl(id, url)) {
    notify.error(t('popup.msg.pageAlreadyExists'));
  }
}
</script>

<template>
  <div class="m-0 flex h-125 w-120 flex-col overflow-hidden bg-background text-foreground shadow-xl">
    <header class="h-12 w-full">
      <TopOperation
        v-model:search-text="searchText"
        :current-tab
        :page-tags
        :favorited-filter-option
        :restorable-item-count
        @add-page="addPage"
        @change-favorited-view="changeFavoritedView"
        @open-random-page="sendMessage('openRandomPage')"
        @open-setting="browser.runtime.openOptionsPage"
        @restore-removed-page="pageActions.restoreRemoved"
      />
    </header>

    <main class="flex-1 overflow-hidden">
      <ScrollArea class="h-full pr-2">
        <PageList
          :current-tab
          :page-list="pageListDisplayed"
          :page-tags
          :favicon-caching
          @mark-read="pageActions.remove"
          @edit="pageActions.update"
          @toggle-star="pageActions.toggleFavorite"
          @open-url="openUrl"
          @copy-url="copyUrl"
          @update-title="pageActions.updateTitle"
          @update-url="updateUrl"
          @move-to-top="pageActions.moveToTop"
        />
      </ScrollArea>
    </main>

    <footer class="flex items-center justify-between border-t bg-muted/40 px-2 py-1.5">
      <Badge variant="outline" class="rounded-full bg-green-600/10 font-mono font-bold text-green-600">
        {{ pageListFiltered.length }}
      </Badge>

      <Pagination
        v-model:page="current"
        :total="pageListFiltered.length"
        :items-per-page="pageSize"
        :sibling-count="0"
        show-edges
      >
        <PaginationContent v-slot="{ items }" class="flex items-center gap-1">
          <PaginationFirst />
          <PaginationPrevious />

          <template v-for="(item, index) in items">
            <PaginationItem
              v-if="item.type === 'page'"
              :key="index"
              :value="item.value"
              as-child
            >
              <Button
                :class="cn(
                  'size-8 p-0 transition-all',
                  item.value === current && 'hover:bg-primary hover:text-primary-foreground',
                )"
                :variant="item.value === current ? 'default' : 'ghost'"
              >
                {{ item.value }}
              </Button>
            </PaginationItem>
            <PaginationEllipsis v-else :key="item.type" :index="index" />
          </template>

          <PaginationNext />
          <PaginationLast />
        </PaginationContent>
      </Pagination>
    </footer>
  </div>
</template>
