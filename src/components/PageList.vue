<script setup lang="ts">
import { List, ListItem, ListItemMeta, Avatar } from 'ant-design-vue';

import { type PageItem } from '@/utils/types';

defineProps<{
    pageList: PageItem[];
}>();
</script>

<template>
    <List :dataSource="pageList" size="small">
        <template #renderItem="{ item }: { item: PageItem }">
            <ListItem :key="item.id">
                <ListItemMeta :title="item.info.title" :description="item.info.url">
                    <template #avatar>
                        <Avatar :src="item.info.faviconUrl" />
                    </template>
                </ListItemMeta>
            </ListItem>
        </template>
    </List>
</template>
