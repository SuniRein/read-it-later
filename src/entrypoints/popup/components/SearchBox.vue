<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core';
import { Input } from 'ant-design-vue';
import { computed } from 'vue';

import useI18n from '@/composables/i18n';

const props = defineProps<{ value: string }>();
const emit = defineEmits<{ (e: 'update:value', value: string): void }>();

const emitDebounced = useDebounceFn((value: string) => {
    emit('update:value', value);
}, 300);

const rawText = computed<string>({
    get: () => props.value,
    set: emitDebounced,
});

const { t } = useI18n();
</script>

<template>
    <Input v-model:value.trim="rawText" allow-clear :placeholder="t('search')" />
</template>
