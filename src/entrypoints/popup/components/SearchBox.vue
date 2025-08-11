<script setup lang="ts">
import { CloseCircleFilled } from '@ant-design/icons-vue';
import { useDebounceFn } from '@vueuse/core';
import { AutoComplete } from 'ant-design-vue';
import { computed, ref, watch } from 'vue';

import useI18n from '@/composables/i18n';

const props = defineProps<{
    value: string;
    autofocus?: boolean;
    tags: string[];
}>();

const emit = defineEmits<{ (e: 'update:value', value: string): void }>();
const emitDebounced = useDebounceFn((value: string) => emit('update:value', value), 300);

const rawText = ref('');

watch(() => props.value, (newValue) => {
    if (newValue !== rawText.value.trim()) {
        rawText.value = newValue;
    }
}, { immediate: true });

watch(rawText, newValue => emitDebounced(newValue.trim()));

const { t } = useI18n();

const lastToken = computed(() => {
    return rawText.value.slice(rawText.value.lastIndexOf(' ') + 1);
});

const textBeforeLastToken = computed(() => {
    return rawText.value.slice(0, rawText.value.length - (lastToken.value?.length ?? 0));
});

const options = computed(() => {
    if (lastToken.value?.startsWith('#')) {
        const tag = lastToken.value.slice(1);
        return props.tags.filter(t => t.startsWith(tag)).map(t => ({
            value: `${textBeforeLastToken.value}#${t}`,
            label: t,
        }));
    }
    return [];
});
</script>

<template>
    <AutoComplete
        v-model:value="rawText"
        :placeholder="t('search')"
        :autofocus
        allow-clear
        :options
    >
        <template #clearIcon>
            <CloseCircleFilled @click.capture="emit('update:value', '')" />
        </template>
    </AutoComplete>
</template>
