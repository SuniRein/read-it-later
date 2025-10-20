<script setup lang="ts">
import type { PageItem } from '@/utils/types';

import { CheckOutlined, CopyOutlined, EditFilled, StarFilled } from '@ant-design/icons-vue';
import { List, ListItem } from 'ant-design-vue';
import { ref } from 'vue';

import { useFavicon } from '@/composables/favicon';
import { isFirefox, urlRestricted } from '@/utils/firefox';

import ColorTag from './ColorTag.vue';
import Favicon from './Favicon.vue';
import IconButton from './IconButton.vue';
import PageEditing from './PageEditing.vue';

const { currentUrl, pageList, pageTags, faviconCaching } = defineProps<{
    currentUrl: string | null;
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
}>();

const { getFaviconUrl } = useFavicon();

const actionAttr = {
    color: '#555',
    size: 'large',
} as const;

const editedId = ref<string | null>(null);
const editedTitle = ref<string>('');
const editedTags = ref<string[]>([]);

function editPage(item: PageItem) {
    editedId.value = item.id;
    editedTitle.value = item.info.title;
    editedTags.value = item.tags;
}

function savePageEdit(title: string, tags: string[]) {
    if (!editedId.value)
        return;
    emit('edit', editedId.value, title, tags);
    editedId.value = null;
}

function urlClickable(url: string): boolean {
    if (isFirefox() && urlRestricted(url)) {
        return false;
    }
    return true;
}
</script>

<template>
    <List :data-source="pageList" size="small">
        <template #renderItem="{ item }: { item: PageItem }">
            <ListItem :key="item.id">
                <div
                    v-if="editedId !== item.id" class="page-list-item" :class="{
                        favorited: item.favorited,
                        current: item.info.url === currentUrl,
                    }"
                >
                    <div
                        class="item-content"
                        :class="{ clickable: urlClickable(item.info.url) }"
                        v-on="{ click: urlClickable(item.info.url) ? () => emit('openUrl', item.info.url) : undefined }"
                    >
                        <div class="favicon-and-title">
                            <Favicon :url="getFaviconUrl(item.info.url)" :use-cache="faviconCaching" />
                            <span class="title">{{ item.info.title }}</span>
                        </div>

                        <div class="url-and-tags">
                            <span class="url">{{ item.info.url }}</span>

                            <div class="tags">
                                <ColorTag v-for="tag in item.tags" :key="tag" :tag />
                            </div>
                        </div>
                    </div>

                    <div class="actions">
                        <IconButton v-bind="actionAttr" :icon="CopyOutlined" @click="emit('copyUrl', item.info.url)" />
                        <IconButton v-bind="actionAttr" :icon="EditFilled" @click="editPage(item)" />
                        <IconButton v-bind="actionAttr" :icon="StarFilled" @click="emit('toggleStar', item.id)" />
                        <IconButton v-bind="actionAttr" :icon="CheckOutlined" @click="emit('markRead', item.id)" />
                    </div>
                </div>

                <PageEditing
                    v-else
                    :init-title="editedTitle"
                    :init-tags="editedTags"
                    :page-tags
                    @cancel="editedId = null"
                    @save="savePageEdit"
                />
            </ListItem>
        </template>
    </List>
</template>

<style scoped>
:deep(.ant-list-item) {
    padding: 0;
}

.page-list-item {
    --favorited-bg-rgb: 249, 232, 144;
    --favorited-bg: #f9e890;

    --current-page-background-color: hsl(0, 0, 90%);
    --current-page-border-color: hsl(0, 0, 30%);
    --current-page-accent-color: #409eff;

    margin: 0;
    padding: 0 0.5rem;
    position: relative;
    width: 100%;

    box-sizing: border-box;
}

.page-list-item.favorited {
    background-color: rgba(var(--favorited-bg-rgb), 0.8);
}

.page-list-item.current {
    background-color: var(--current-page-background-color);

    &.favorited {
        background-color: var(--favorited-bg);
    }

    padding: 0.2rem 0.5rem;
    font-weight: bold;

    /* left highlight bar */
    &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0.2rem;
        bottom: 0.2rem;
        width: 4px;
        background-color: var(--current-page-accent-color);
        border-radius: 2px;
        transition: background-color 0.2s ease;
    }
}

.item-content {
    &.clickable {
        cursor: pointer;
    }

    &:not(.clickable) {
        cursor: not-allowed;
    }
}

.favicon-and-title {
    display: flex;
    align-items: center;
}

.title {
    display: inline-block;
    line-height: calc(1.25rem + 6px);
    font-size: 1.25rem;
    padding: 0.3rem 0px;

    user-select: text;
    white-space: nowrap;
    overflow-x: hidden;
    text-overflow: ellipsis;
}

.url-and-tags {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.url {
    display: inline-block;
    font-size: 0.875rem;
    padding: 0.2rem 0px;

    user-select: text;
    white-space: nowrap;
    overflow: hidden;
    text-decoration: none;
    text-overflow: ellipsis;

    color: gray;

    flex: 1;
    min-width: 0;
}

.tags {
    font-size: 0.75rem;

    & > *:last-child {
        margin-right: 0;
    }
}

.actions {
    z-index: 3;
    position: absolute;
    right: 0;
    top: 0;

    height: 100%;
    display: flex;
    align-items: center;

    opacity: 0;
    transition:
        height 200ms ease-out,
        opacity 200ms ease-out;
}

.page-list-item:hover .actions {
    background-color: rgba(196, 196, 196, 0.4);
    opacity: 1;
}
</style>
