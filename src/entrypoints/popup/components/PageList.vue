<script setup lang="ts">
import type { PageItem, Tab } from '@/utils/types';

import { ArrowUpToLine, Check, Copy, Edit2, RefreshCw, Star } from 'lucide-vue-next';
import { useFavicon } from '@/composables/favicon';
import { IS_FIREFOX, urlRestricted } from '@/utils/firefox';

import ColorTag from './ColorTag.vue';
import Favicon from './Favicon.vue';
import PageEditing from './PageEditing.vue';

const { currentTab, pageList, pageTags, faviconCaching } = defineProps<{
  currentTab: Tab | null;
  pageList: PageItem[];
  pageTags: string[];
  faviconCaching: boolean;
}>();

const emit = defineEmits<{
  (e: 'markRead', id: string): void;
  (e: 'edit', id: string, newTitle: string, newTags: string[]): void;
  (e: 'toggleStar', id: string): void;
  (e: 'openUrl', url: string): void;
  (e: 'copyUrl', url: string): void;
  (e: 'updateTitle', id: string, title: string): void;
  (e: 'updateUrl', id: string, url: string): void;
  (e: 'moveToTop', id: string): void;
}>();

const { t } = useI18n();

const { getFaviconUrl } = useFavicon();

const editedId = ref<string | null>(null);
const editedTitle = ref<string>('');
const editedTags = ref<string[]>([]);

function editPage(item: PageItem) {
  editedId.value = item.id;
  editedTitle.value = item.info.title;
  editedTags.value = item.tags;
}

function savePageEdit(title: string, tags: string[]) {
  if (editedId.value === null)
    return;
  emit('edit', editedId.value, title, tags);
  editedId.value = null;
}

function urlClickable(url: string): boolean {
  if (IS_FIREFOX && urlRestricted(url)) {
    return false;
  }
  return true;
}
</script>

<template>
  <div class="flex w-full flex-col bg-background">
    <div v-for="item in pageList" :key="item.id" class="group relative">
      <ContextMenu v-if="editedId !== item.id">
        <ContextMenuTrigger>
          <div
            v-if="item.info.url === currentTab?.url"
            class="absolute inset-y-1 w-1 rounded-full bg-linear-to-b from-blue-400 via-blue-600 to-blue-400 opacity-90"
          />
          <div
            :class="cn(
              `
                flex flex-col border-b px-1 py-1.5 transition-colors
                group-last:border-0
                hover:bg-accent/70
              `,
              item.favorited && `
                bg-yellow-200/50
                hover:bg-yellow-200/70
                dark:bg-yellow-900/10
              `,
            )"
          >
            <div
              class="flex flex-col gap-1"
              :class="urlClickable(item.info.url) ? 'cursor-pointer' : 'cursor-not-allowed'"
              @click="urlClickable(item.info.url) && emit('openUrl', item.info.url)"
            >
              <div class="flex items-center gap-2">
                <Favicon :url="getFaviconUrl(item.info.url)" :use-cache="faviconCaching" />
                <span class="truncate pr-4 text-lg/tight font-semibold">{{ item.info.title }}</span>
              </div>

              <div class="flex items-center justify-between gap-4">
                <span class="flex-1 truncate font-mono text-sm text-muted-foreground">{{ item.info.url }}</span>
                <div class="flex gap-1">
                  <ColorTag v-for="tag in item.tags" :key="tag" :tag="tag" />
                </div>
              </div>
            </div>

            <div
              class="
                absolute top-1/2 right-1 flex -translate-y-1/2 items-center gap-1 opacity-0 transition-opacity
                group-hover:opacity-100
              "
            >
              <Button
                variant="ghost" class="
                  size-10 border border-input shadow-sm
                  hover:bg-primary hover:text-primary-foreground
                " @click.stop="emit('copyUrl', item.info.url)"
              >
                <Copy />
              </Button>

              <Button
                variant="ghost" class="
                  size-10 border border-input shadow-sm
                  hover:bg-primary hover:text-primary-foreground
                " @click.stop="editPage(item)"
              >
                <Edit2 />
              </Button>

              <Button
                variant="ghost" class="size-10 border border-input shadow-sm"
                :class="item.favorited ? `
                  border-yellow-200 bg-yellow-50 text-yellow-400
                  hover:bg-yellow-400 hover:text-white
                ` : `hover:text-yellow-500`"
                @click.stop="emit('toggleStar', item.id)"
              >
                <Star />
              </Button>

              <Button
                variant="ghost" class="
                  size-10 border border-input text-green-600 shadow-sm
                  hover:bg-green-600 hover:text-white
                " @click.stop="emit('markRead', item.id)"
              >
                <Check />
              </Button>
            </div>
          </div>
        </ContextmenuTrigger>

        <ContextMenuContent>
          <ContextMenuItem @select="currentTab?.title != null && emit('updateTitle', item.id, currentTab.title)">
            <RefreshCw /> {{ t('contextMenu.editItem.updateTitle') }}
          </ContextMenuItem>
          <ContextMenuItem @select="currentTab?.url != null && emit('updateUrl', item.id, currentTab?.url)">
            <RefreshCw /> {{ t('contextMenu.editItem.updateUrl') }}
          </ContextMenuItem>
          <ContextMenuItem @select="emit('moveToTop', item.id)">
            <ArrowUpToLine /> {{ t('contextMenu.editItem.moveToTop') }}
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <PageEditing
        v-else
        :init-title="editedTitle"
        :init-tags="editedTags"
        :page-tags
        @cancel="editedId = null"
        @save="savePageEdit"
      />
    </div>
  </div>
</template>
