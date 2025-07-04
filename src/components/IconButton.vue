<script setup lang="ts">
import { Button, type ButtonProps } from 'ant-design-vue';

defineProps<{
    icon: ButtonProps['icon'];
}>();

const emit = defineEmits<{
    (e: 'click', event: MouseEvent): void;
}>();

function onClick(event: MouseEvent) {
    emit('click', event);
}
</script>

<template>
    <Button type="ghost" ghost :icon @click="onClick" />
</template>
