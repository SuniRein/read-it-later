<script setup lang="ts">
import type { PageItem } from '@/common/types';
import { ArrowUpToLine, Check, Copy, Edit2, Quote, RefreshCw, Star } from 'lucide-vue-next';
import { useSettings } from '@/app/settings';
import { IS_FIREFOX, urlRestricted } from '@/common/firefox';
import { copyToClipboard, openPage } from '@/common/message-actions';
import notify from '@/common/notify';
import { PopupContextKey, StorageItemsKey } from '@/common/symbols';
import { useFaviconUrl } from '@/composables/favicon-url';
import ColorTag from './ColorTag.vue';
import Favicon from './Favicon.vue';

const props = defineProps<{ item: PageItem }>();
const emit = defineEmits<{ requestEdit: [item: PageItem] }>();

const { t } = useI18n();
const ctx = inject(PopupContextKey)!;
const { currentTab, pageActions } = ctx;

const items = inject(StorageItemsKey)!;
const { getFaviconUrl } = useFaviconUrl(items);
const { faviconCaching } = useSettings();

function urlClickable(url: string): boolean {
  return !(IS_FIREFOX && urlRestricted(url));
}

function handleUpdateUrl(id: string, url: string) {
  if (!pageActions.updateUrl(id, url))
    notify.error(t('common.msg.addTab.pageAlreadyExists'));
}
</script>

<template>
  <ContextMenu>
    <ContextMenuTrigger>
      <div
        v-if="props.item.info.url === currentTab?.url"
        class="
          absolute inset-y-1 w-1 rounded-full bg-linear-to-b from-blue-400 via-blue-600 to-blue-400 opacity-90
          dark:from-blue-300 dark:via-blue-400 dark:to-blue-300 dark:opacity-100
          dark:shadow-[0_0_8px_rgba(96,165,250,0.5)]
        "
      />
      <div
        :class="cn(
          `
            flex flex-col border-b border-border px-1 py-1.5 transition-colors
            group-last:border-0
            hover:bg-accent/70
          `,
          props.item.favorited && `
            bg-yellow-200/50
            hover:bg-yellow-200/70
            dark:bg-yellow-400/15
            dark:hover:bg-yellow-400/30
          `,
        )"
      >
        <div
          class="flex flex-col gap-1"
          :class="urlClickable(props.item.info.url) ? 'cursor-pointer' : 'cursor-not-allowed'"
          @click="urlClickable(props.item.info.url) && openPage(props.item.info.url)"
        >
          <div class="flex items-center gap-2">
            <Favicon :url="getFaviconUrl(props.item.info.url)" :use-cache="faviconCaching" />
            <span class="truncate pr-4 text-lg/tight font-semibold">{{ props.item.info.title }}</span>
          </div>

          <div class="flex items-center justify-between gap-4">
            <div class="flex flex-1 items-center gap-1 truncate">
              <HoverCard v-if="props.item.desc" :open-delay="300" :close-delay="200">
                <HoverCardTrigger>
                  <Quote
                    class="
                      size-4 text-muted-foreground
                      hover:text-foreground
                    "
                    @click.stop
                  />
                </HoverCardTrigger>
                <HoverCardContent class="p-1 text-sm whitespace-pre-wrap">
                  {{ props.item.desc }}
                </HoverCardContent>
              </HoverCard>

              <span class="truncate font-mono text-sm text-muted-foreground">{{ props.item.info.url }}</span>
            </div>

            <div class="flex gap-1">
              <ColorTag v-for="tag in props.item.tags" :key="tag" :tag="tag" />
            </div>
          </div>
        </div>

        <div
          class="
            absolute top-1/2 right-1 flex -translate-y-1/2 items-center gap-1 opacity-0 transition-opacity
            group-hover:opacity-100
          "
        >
          <Button variant="ghost" class="size-10 border border-border shadow-sm" @click.stop="copyToClipboard(props.item.info.url)">
            <Copy />
          </Button>

          <Button variant="ghost" class="size-10 border border-border shadow-sm" @click.stop="emit('requestEdit', props.item)">
            <Edit2 />
          </Button>

          <Button
            variant="ghost" class="size-10 border border-border shadow-sm"
            :class="props.item.favorited ? `
              border-yellow-200 bg-yellow-50 text-yellow-400
              hover:bg-yellow-400 hover:text-white
              dark:border-yellow-400/30 dark:bg-yellow-400/10 dark:text-yellow-400
              dark:hover:bg-yellow-400/30 dark:hover:text-white
            ` : `hover:text-yellow-500`"
            @click.stop="pageActions.toggleFavorite(props.item.id)"
          >
            <Star />
          </Button>

          <Button
            variant="ghost" class="
              size-10 border border-border text-green-600 shadow-sm
              hover:text-green-600
            "  @click.stop="pageActions.remove(props.item.id)"
          >
            <Check />
          </Button>
        </div>
      </div>
    </ContextMenuTrigger>

    <ContextMenuContent>
      <ContextMenuItem @select="currentTab?.title != null && pageActions.updateTitle(props.item.id, currentTab.title)">
        <RefreshCw /> {{ t('popup.contextMenu.updateTitle') }}
      </ContextMenuItem>
      <ContextMenuItem @select="currentTab?.url != null && handleUpdateUrl(props.item.id, currentTab?.url)">
        <RefreshCw /> {{ t('popup.contextMenu.updateUrl') }}
      </ContextMenuItem>
      <ContextMenuItem @select="pageActions.moveToTop(props.item.id)">
        <ArrowUpToLine /> {{ t('popup.contextMenu.moveToTop') }}
      </ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>
</template>
