<script setup lang="ts">
import AutoComplete from '@/components/AutoComplete.vue';

const props = defineProps<{
  autofocus?: boolean;
  tags: string[];
}>();

const { t } = useI18n();

const searchText = defineModel<string>({ required: true });
const cursorPos = ref(-1);
const open = ref(false);

const inputRef = useTemplateRef('inputRef');

const hints = computed(() => {
  const text = searchText.value;
  const cursor = cursorPos.value;

  if (cursor === -1)
    return null;

  const start = text.lastIndexOf(' ', cursor - 1) + 1;
  const end = text.indexOf(' ', cursor);
  const actualEnd = end === -1 ? text.length : end;

  return {
    before: text.slice(0, start),
    token: text.slice(start, actualEnd),
    after: text.slice(actualEnd),
  };
});

const filteredTags = computed(() => {
  if (!hints.value)
    return [];
  const { token } = hints.value;

  const prefixes = ['#', '!#'];
  const prefix = prefixes.find(p => token.startsWith(p));
  if (prefix === undefined)
    return [];

  const searchStr = token.slice(prefix.length).toLowerCase();
  return props.tags
    .filter(t => t.toLowerCase().startsWith(searchStr))
    .map(t => ({ value: t, prefix }));
});

function handleSelect(tagName: string, prefix: string) {
  if (!hints.value)
    return;
  const { before, after } = hints.value;

  const insertedText = `${prefix}${tagName}`;
  const newValue = `${before}${insertedText}${after}`;
  const nextPos = before.length + insertedText.length;

  searchText.value = newValue;
  open.value = false;
  inputRef.value?.focus(nextPos);
}
</script>

<template>
  <AutoComplete
    ref="inputRef"
    v-model="searchText"
    v-model:cursor="cursorPos"
    v-model:open="open"
    :items="filteredTags"
    :placeholder="t('popup.searchPlaceholder')"
    :autofocus
    @select="({ value, prefix }) => handleSelect(value, prefix)"
  />
</template>
