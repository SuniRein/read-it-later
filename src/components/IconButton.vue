<script setup lang="ts">
import { h, type Component } from 'vue';

import { Button, Tooltip } from 'ant-design-vue';

defineProps<{
    icon: Component;
    tip: string;
}>();

const emit = defineEmits<{
    (e: 'click', event: MouseEvent): void;
}>();

function onClick(event: MouseEvent) {
    emit('click', event);
}

const iconStyle = {
    color: '#CCC',
};
</script>

<template>
    <Tooltip :title="tip" placement="bottomRight">
        <Button type="ghost" ghost :icon="h(icon, { style: iconStyle })" @click="onClick" />
    </Tooltip>
</template>
