<script setup lang="ts">
import { List, ListItem, Avatar } from 'ant-design-vue';

import { type PageItem } from '@/utils/types';

defineProps<{
    pageList: PageItem[];
}>();
</script>

<template>
    <List :dataSource="pageList" size="small">
        <template #renderItem="{ item }: { item: PageItem }">
            <ListItem>
                <div class="page-list-item">
                    <div class="favicon-and-title">
                        <Avatar class="favicon" :src="item.info.faviconUrl" size="small" />
                        <span class="title">{{ item.info.title }}</span>
                    </div>

                    <span class="url">{{ item.info.url }}</span>
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
    margin: 0;
    padding: 0 0.5rem;
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
</style>
