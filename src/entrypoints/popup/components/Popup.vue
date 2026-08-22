<script lang="ts" setup>
import { useSettings } from '@/app/settings';
import { handleNotify } from '@/common/message';
import { isPopoutMode } from '@/common/message-actions';
import { PopupContextKey, StorageItemsKey } from '@/common/symbols';
import { useCurrentTab } from '@/composables/current-tab';
import { usePageListContext } from '@/composables/page-list';
import { usePagination } from '@/composables/pagination';
import { createSyncLogApi } from '@/services/sync/log';
import PageList from './PageList.vue';
import PopupFooter from './PopupFooter.vue';
import TopOperation from './TopOperation.vue';

const items = inject(StorageItemsKey)!;
const { t } = useI18n();

const { pagination: pageSize } = useSettings(items);

const ctx = usePageListContext(items, { logOp: createSyncLogApi(items).append });
const { pageListFiltered } = ctx;

const { currentTab } = useCurrentTab();
const currentUrl = computed(() => currentTab.value?.url ?? null);

const pager = usePagination(pageListFiltered, pageSize);
const { current } = pager;

const displayedList = computed(() => {
  const paginated = pager.pageSlice.value;
  const currentPage = ctx.pageList.value.find(item => item.info.url === currentUrl.value);
  return currentPage !== undefined
    ? [currentPage, ...paginated.filter(item => item.info.url !== currentUrl.value)]
    : paginated;
});

const pageTags = computed(() =>
  Array.from(new Set(ctx.pageList.value.flatMap(item => item.tags))),
);

handleNotify(t);

const isPopout = isPopoutMode();

provide(PopupContextKey, { ...ctx, currentTab, displayedList, pageTags, isPopout });
</script>

<template>
  <!-- Use Fixed height and width so that the popup size won't change when text size changes. -->
  <div
    :class="cn(
      'm-0 flex flex-col overflow-hidden bg-background text-foreground shadow-xl',
      isPopout ? 'h-screen w-screen' : 'h-125 w-120',
    )"
  >
    <header class="h-12 w-full">
      <TopOperation />
    </header>

    <main class="flex-1 overflow-hidden">
      <ScrollArea class="h-full pr-2">
        <PageList />
      </ScrollArea>
    </main>

    <PopupFooter v-model:page="current" :total="pageListFiltered.length" :items-per-page="pageSize" />
  </div>
</template>
