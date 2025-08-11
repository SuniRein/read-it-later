<script setup lang="ts">
import { CloseCircleFilled } from '@ant-design/icons-vue';
import { useDebounceFn } from '@vueuse/core';
import { Input } from 'ant-design-vue';
import { ref, watch } from 'vue';

import useI18n from '@/composables/i18n';

const props = defineProps<{
    value: string;
    autofocus?: boolean;
}>();

const emit = defineEmits<{ (e: 'update:value', value: string): void }>();
const emitDebounced = useDebounceFn((value: string) => emit('update:value', value), 300);

const rawText = ref('');

watch(() => props.value, (newValue) => {
    if (newValue !== rawText.value) {
        rawText.value = newValue;
    }
}, { immediate: true });

watch(rawText, newValue => emitDebounced(newValue));

const { t } = useI18n();
</script>

<template>
    <Input v-model:value.trim="rawText" allow-clear :placeholder="t('search')" :autofocus>
        <template #clearIcon>
            <CloseCircleFilled @click.capture="emit('update:value', '')" />
        </template>
    </Input>
</template>
