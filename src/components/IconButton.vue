<script setup lang="ts">
import { Button, type ButtonProps, Tooltip } from 'ant-design-vue';

defineProps<{
    icon: ButtonProps['icon'];
    tip: string;
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
        <Button type="ghost" ghost :icon @click="onClick" />
    </Tooltip>
</template>
