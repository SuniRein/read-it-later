<script setup lang="ts">
import { X } from 'lucide-vue-next';
import { ComboboxAnchor, ComboboxContent, ComboboxInput, ComboboxItem, ComboboxPortal, ComboboxRoot, ComboboxViewport } from 'reka-ui';

const props = defineProps<{
  autofocus?: boolean;
  tags: string[];
}>();

const { t } = useI18n();

const searchText = defineModel<string>({ required: true });

const open = ref(false);
const cursorPos = ref(-1);

function updateCursor(e: Event) {
  const target = e.target as HTMLInputElement;
  cursorPos.value = target.selectionStart ?? -1;
}

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
    .map(t => ({ label: t, prefix }));
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

  void nextTick(() => {
    const inputEl = inputRef.value?.$el as HTMLInputElement | null;
    if (inputEl) {
      inputEl.setSelectionRange(nextPos, nextPos);
      inputEl.focus();
      cursorPos.value = nextPos;
    }
  });
}
</script>

<template>
  <ComboboxRoot v-model:open="open" class="relative" ignore-filter>
    <ComboboxAnchor as-child>
      <div class="relative">
        <ComboboxInput
          ref="inputRef"
          v-model="searchText"
          class="
            flex w-full rounded-md border bg-background px-2 py-1 text-lg
            focus:ring-1 focus:ring-ring focus:outline-none
            disabled:cursor-not-allowed disabled:opacity-50
          "
          :placeholder="t('search')"
          :auto-focus="autofocus"
          @input="updateCursor"
          @click="updateCursor"
          @keyup.left="updateCursor"
          @keyup.right="updateCursor"
          @focus="open = true"
        />
        <X
          v-if="searchText.length > 0"
          class="
            absolute top-1/2 right-1 size-5 -translate-y-1/2 cursor-pointer text-muted-foreground
            hover:text-foreground
          "
          @click="searchText = ''; cursorPos = 0;"
        />
      </div>
    </ComboboxAnchor>

    <ComboboxPortal>
      <ComboboxContent
        v-if="filteredTags.length > 0"
        class="
          z-50 mt-2 max-h-50 w-full min-w-(--reka-combobox-trigger-width) animate-in overflow-hidden rounded-md border
          bg-popover text-popover-foreground shadow-md fade-in-0 zoom-in-95
        "
        align="start"
        position="popper"
      >
        <ComboboxViewport>
          <ComboboxItem
            v-for="tag in filteredTags"
            :key="tag.label"
            :value="tag.label"
            class="
              relative flex cursor-default items-center rounded-sm p-1 text-sm outline-none select-none
              data-disabled:pointer-events-none data-disabled:opacity-50
              data-highlighted:bg-accent data-highlighted:text-accent-foreground
            "
            @select.prevent="handleSelect(tag.label, tag.prefix)"
          >
            {{ tag.label }}
          </ComboboxItem>
        </ComboboxViewport>
      </ComboboxContent>
    </ComboboxPortal>
  </ComboboxRoot>
</template>
