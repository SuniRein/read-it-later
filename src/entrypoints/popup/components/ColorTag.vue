<script setup lang="ts">
import { computed } from 'vue';

import { Tag } from 'ant-design-vue';

const { tag } = defineProps<{
    tag: string;
}>();

const presetColors = [
    'pink',
    'green',
    'cyan',
    'red',
    'blue',
    'purple',
    'orange',
    'geekblue',
    'volcano',
    'gold',
    'lime',
] as const;

function hashString(str: string): number {
    return Array.from(str).reduce((hash, char) => (hash << 5) - hash + char.charCodeAt(0), 0);
}

const tagColor = computed(() => {
    const index = Math.abs(hashString(tag)) % presetColors.length;
    return presetColors[index];
});
</script>

<template>
    <Tag :color="tagColor">{{ tag }}</Tag>
</template>
