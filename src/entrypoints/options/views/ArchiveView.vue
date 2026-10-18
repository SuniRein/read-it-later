<script setup lang="ts">
import type { PageItem } from '@/common/types';
import { Archive, Quote, Trash2, Undo2 } from 'lucide-vue-next';
import { useSettings } from '@/app/settings';
import { StorageItemsKey } from '@/common/symbols';
import { usePageList } from '@/composables/page-list';
import { usePagination } from '@/composables/pagination';
import { createSyncLogApi } from '@/services/sync/log';
import { MAX_ARCHIVED_PAGES } from '@/storage';

const { t } = useI18n();
const items = inject(StorageItemsKey)!;

const ARCHIVE_PAGE_SIZE = 50;

const { setting } = useSettings(items);
const { archivedPageList, ready, restoreArchivedPage, findArchivedConflict, deleteArchivedPage, clearArchivedPages } = usePageList(
  items,
  createSyncLogApi(items, () => setting.value.cloudSyncEnabled).append,
);
await ready;

// `archivedPageList` keeps removal order (oldest first); show the newest first.
const displayedList = computed(() => [...archivedPageList.value].reverse());
const { current, pageSlice, goto } = usePagination(displayedList, ARCHIVE_PAGE_SIZE);
// Removing entries can leave `current` past the last page.
watch(displayedList, () => goto(current.value));

const pendingRestore = ref<PageItem | null>(null);
const showDetail = ref(false);

function handleRestore(item: PageItem) {
  if (findArchivedConflict(item.id) === undefined)
    restoreArchivedPage(item.id);
  else
    pendingRestore.value = item;
}

function overwriteRestore() {
  if (pendingRestore.value !== null)
    restoreArchivedPage(pendingRestore.value.id, 'overwrite');
  pendingRestore.value = null;
}
</script>

<template>
  <div class="mx-auto max-w-3xl space-y-8 p-6">
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2 text-lg">
          <Archive class="size-5" /> {{ t('option.archive.title') }}
          <Badge variant="outline">
            {{ displayedList.length }}
          </Badge>
        </CardTitle>
        <CardDescription>{{ t('option.archive.desc', { max: MAX_ARCHIVED_PAGES }) }}</CardDescription>
        <CardAction class="flex items-center gap-2">
          <Label for="archive-detail" class="text-sm font-normal text-muted-foreground">
            {{ t('option.archive.detail') }}
          </Label>
          <Switch id="archive-detail" v-model="showDetail" />
        </CardAction>
      </CardHeader>

      <CardContent>
        <p v-if="displayedList.length === 0" class="py-10 text-center text-sm text-muted-foreground">
          {{ t('option.archive.empty') }}
        </p>
        <ul v-else class="divide-y divide-border">
          <li v-for="item in pageSlice" :key="item.id" class="flex items-start gap-3 py-3">
            <div class="min-w-0 flex-1 space-y-1">
              <p class="truncate font-medium">
                {{ item.info.title }}
              </p>
              <p
                class="
                  truncate font-mono text-xs text-sky-600/90
                  hover:underline
                  dark:text-sky-400/90
                "
              >
                {{ item.info.url }}
              </p>
              <template v-if="showDetail">
                <div v-if="item.desc" class="mt-0.5 flex items-start gap-1">
                  <Quote class="mt-0.5 size-3 shrink-0 text-muted-foreground" />
                  <p class="line-clamp-2 text-xs whitespace-pre-wrap text-muted-foreground">
                    {{ item.desc }}
                  </p>
                </div>
                <div v-if="item.tags.length > 0" class="flex flex-wrap gap-1 pt-0.5 text-xs">
                  <ColorTag v-for="tag in item.tags" :key="tag" :tag class="text-xs" />
                </div>
              </template>
            </div>

            <div class="flex shrink-0 items-center gap-2">
              <Button variant="outline" size="sm" @click="handleRestore(item)">
                <Undo2 /> {{ t('option.archive.action.restore') }}
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                class="
                  text-destructive/80
                  hover:bg-destructive/10 hover:text-destructive/90
                "
                :aria-label="t('option.archive.action.delete')"
                :title="t('option.archive.action.delete')"
                @click="deleteArchivedPage(item.id)"
              >
                <Trash2 />
              </Button>
            </div>
          </li>
        </ul>
      </CardContent>

      <CardFooter v-if="displayedList.length > 0" class="justify-end gap-3">
        <div v-if="displayedList.length > ARCHIVE_PAGE_SIZE" class="mr-auto">
          <PaginationBar
            v-model:page="current"
            :total="displayedList.length"
            :items-per-page="ARCHIVE_PAGE_SIZE"
          />
        </div>

        <AlertDialog>
          <AlertDialogTrigger as-child>
            <Button variant="destructive" size="sm">
              <Trash2 /> {{ t('option.archive.action.clear') }}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{{ t('option.archive.confirmClear.title') }}</AlertDialogTitle>
              <AlertDialogDescription>{{ t('option.archive.confirmClear.desc') }}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{{ t('common.action.cancel') }}</AlertDialogCancel>
              <AlertDialogAction
                class="
                  bg-destructive
                  hover:bg-destructive/80
                " @click="clearArchivedPages"
              >
                {{ t('common.action.confirm') }}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>

    <AlertDialog
      :open="pendingRestore !== null"
      @update:open="(open) => { if (!open) pendingRestore = null }"
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{{ t('option.archive.conflict.title') }}</AlertDialogTitle>
          <AlertDialogDescription>{{ t('option.archive.conflict.desc') }}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" @click="pendingRestore = null">
            {{ t('option.archive.conflict.skip') }}
          </Button>
          <Button @click="overwriteRestore">
            {{ t('option.archive.conflict.overwrite') }}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>
