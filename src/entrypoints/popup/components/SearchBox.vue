<script setup lang="ts">
import { refDebounced } from '@vueuse/core';
import { AutoComplete, Input } from 'ant-design-vue';
import { computed, onMounted, ref, useTemplateRef } from 'vue';

import useI18n from '@/composables/i18n';

const props = defineProps<{
  autofocus?: boolean;
  tags: string[];
}>();

const { t } = useI18n();

const searchText = defineModel<string>({ required: true });
const debouncedSearchText = refDebounced(searchText, 200);

const input = useTemplateRef('input');
const inputEl = computed(() => input.value?.$el.querySelector('input') as HTMLInputElement | undefined);

const cursorPos = ref(-1);
onMounted(() => {
  if (!inputEl.value)
    return;

  const updateCursorPos = () => cursorPos.value = inputEl.value!.selectionStart ?? -1;
  inputEl.value.addEventListener('keyup', updateCursorPos);
  inputEl.value.addEventListener('click', updateCursorPos);
  updateCursorPos();
});

const hints = computed(() => {
  const start = debouncedSearchText.value.lastIndexOf(' ', cursorPos.value - 1) + 1;
  const end = debouncedSearchText.value.indexOf(' ', cursorPos.value);

  return {
    before: debouncedSearchText.value.slice(0, start),
    token: debouncedSearchText.value.slice(start, end === -1 ? undefined : end),
    after: end === -1 ? '' : debouncedSearchText.value.slice(end),
  };
});

const options = computed(() => {
  const { before, token, after } = hints.value;

  const prefixes = ['#', '!#'];
  const prefix = prefixes.find(p => token.startsWith(p));
  if (prefix !== undefined) {
    const tag = token.slice(prefix.length);
    return props.tags.filter(t => t.startsWith(tag)).map(t => ({
      value: `${before}${prefix}${t}${after}`,
      label: t,
      finalCursorPos: before.length + prefix.length + t.length,
    }));
  }
  return [];
});

function setCursorPos(_value: any, option: any) {
  const finalCursorPos = option.finalCursorPos as number;
  setTimeout(() => {
    inputEl.value?.setSelectionRange(finalCursorPos, finalCursorPos);
  }, 0);
}
</script>

<template>
  <AutoComplete
    v-model:value="searchText"
    :autofocus
    :options
    @select="setCursorPos"
  >
    <Input ref="input" :placeholder="t('search')" allow-clear />
  </AutoComplete>
</template>
