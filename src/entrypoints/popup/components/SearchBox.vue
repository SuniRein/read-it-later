<script setup lang="ts">
import { AutoComplete, Input } from 'ant-design-vue';
import { computed } from 'vue';

import useI18n from '@/composables/i18n';

const props = defineProps<{
    autofocus?: boolean;
    tags: string[];
}>();

const searchText = defineModel<string>({ required: true });

const { t } = useI18n();

const lastToken = computed(() => {
    return searchText.value.slice(searchText.value.lastIndexOf(' ') + 1);
});

const textBeforeLastToken = computed(() => {
    return searchText.value.slice(0, searchText.value.length - (lastToken.value?.length ?? 0));
});

const options = computed(() => {
    const prefixes = ['#', '!#'];
    const prefix = prefixes.find(p => lastToken.value?.startsWith(p));
    if (prefix) {
        const tag = lastToken.value.slice(prefix.length);
        return props.tags.filter(t => t.startsWith(tag)).map(t => ({
            value: `${textBeforeLastToken.value}${prefix}${t}`,
            label: t,
        }));
    }
    return [];
});
</script>

<template>
    <AutoComplete
        v-model:value="searchText"
        :autofocus
        :options
    >
        <Input :placeholder="t('search')" allow-clear />
    </AutoComplete>
</template>
