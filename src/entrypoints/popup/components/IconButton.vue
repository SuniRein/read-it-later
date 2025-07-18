<script setup lang="ts">
import type { Component } from 'vue';

import { Button, Tooltip } from 'ant-design-vue';
import { h } from 'vue';

defineProps<{
    icon: Component;
    tip?: string;
    color?: string;
    size?: 'small' | 'middle' | 'large';
}>();

const emit = defineEmits<{
    (e: 'click', event: MouseEvent): void;
}>();

function onClick(event: MouseEvent) {
    emit('click', event);
}
</script>

<template>
    <Tooltip :title="tip" placement="bottomRight">
        <Button
            type="ghost" ghost :size :icon="h(icon, {
                style: {
                    color: color ?? '#CCC',
                },
            })" @click="onClick"
        />
    </Tooltip>
</template>
