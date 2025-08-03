<script setup lang="ts">
import { watchDebounced } from '@vueuse/core';
import { Input } from 'ant-design-vue';
import { ref } from 'vue';

const emit = defineEmits<{ (e: 'search', text: string): void }>();

const rawText = ref<string>('');

watchDebounced(rawText, value => emit('search', value), { debounce: 300 });
</script>

<template>
    <Input v-model:value.trim="rawText" allow-clear placeholder="Find..." />
</template>
