<script setup lang="ts">
import { List, ListItem, Avatar } from 'ant-design-vue';
import { CheckOutlined, EditFilled, StarFilled, DeleteFilled } from '@ant-design/icons-vue';

import IconButton from './IconButton.vue';

import type { PageItem } from '@/utils/types';

const { currentUrl, pageList } = defineProps<{
    currentUrl: string | null;
    pageList: PageItem[];
}>();

const emit = defineEmits<{
    (e: 'mark-read', id: string): void;
    (e: 'edit', id: string, newTitle: string, newTags: string[]): void;
    (e: 'toggle-star', id: string): void;
    (e: 'delete', id: string): void;
    (e: 'open-url', url: string): void;
}>();

const actionAttr = {
    color: '#555',
    size: 'large',
} as const;

function toggleEditMode(id: string) {
    // TODO: Implement edit mode
}
</script>

<template>
    <List :dataSource="pageList" size="small">
        <template #renderItem="{ item }: { item: PageItem }">
            <ListItem :key="item.id">
                <div
                    class="page-list-item"
                    :class="{
                        favorited: item.favorited,
                        current: item.info.url === currentUrl,
                    }"
                >
                    <div class="item-content" @click="$emit('open-url', item.info.url)">
                        <div class="favicon-and-title">
                            <Avatar class="favicon" :src="item.info.faviconUrl" size="small" />
                            <span class="title">{{ item.info.title }}</span>
                        </div>

                        <span class="url">{{ item.info.url }}</span>
                    </div>

                    <div class="actions">
                        <IconButton v-bind="actionAttr" :icon="CheckOutlined" @click="$emit('mark-read', item.id)" />
                        <IconButton v-bind="actionAttr" :icon="EditFilled" />
                        <IconButton v-bind="actionAttr" :icon="StarFilled" @click="emit('toggle-star', item.id)" />
                        <IconButton v-bind="actionAttr" :icon="DeleteFilled" @click="emit('delete', item.id)" />
                    </div>
                </div>
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

.favicon-and-title {
    display: flex;
    align-items: center;
}

.favicon {
    height: 16px;
    width: 16px;
    margin-right: 0.5rem;
    vertical-align: middle;
    position: relative;
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

    cursor: pointer;
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

    cursor: pointer;
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
