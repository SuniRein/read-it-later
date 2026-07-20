<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { X } from 'lucide-vue-next';
import { ComboboxAnchor, ComboboxContent, ComboboxInput, ComboboxItem, ComboboxPortal, ComboboxRoot, ComboboxViewport } from 'reka-ui';
import { useTokenComplete } from '@/composables/token-complete';

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    /** Candidate strings offered by this autocompleter. */
    candidates: string[];
    /** Characters that terminate a token. Default: `[' ']`. */
    delimiters?: string[];
    /** Optional prefixes a token must start with to be completable. Default: none. */
    prefixes?: string[];
    /** Strip leading whitespace from the token before matching. Default: `false`. */
    trimToken?: boolean;
    placeholder?: string;
    autofocus?: boolean;
    class?: HTMLAttributes['class'];
    rootClass?: HTMLAttributes['class'];
  }>(),
  {
    delimiters: () => [' '],
    prefixes: () => [],
    trimToken: false,
  },
);

const emit = defineEmits<{
  select: [item: string];
}>();

const input = defineModel<string>({ required: true });
const cursor = ref(-1);
const open = ref(false);

const { candidates, delimiters, prefixes, trimToken } = toRefs(props);
const { items, select } = useTokenComplete({
  input,
  cursor,
  candidates,
  delimiters,
  prefixes,
  trimToken,
});

function syncCursor(e: Event) {
  const target = e.target as HTMLInputElement;
  cursor.value = target.selectionStart ?? -1;
}

const inputRef = useTemplateRef('inputRef');

function focus(newPos: number) {
  const inputEl = inputRef.value?.$el as HTMLInputElement | null;
  if (!inputEl)
    return;
  inputEl.focus();
  void nextTick(() => {
    inputEl.setSelectionRange(newPos, newPos);
    cursor.value = newPos;
  });
}

function handleSelect(item: string) {
  const { value, cursor: nextPos } = select(item);
  input.value = value;
  open.value = false;
  emit('select', item);
  focus(nextPos);
}

defineExpose({ focus });
</script>

<template>
  <ComboboxRoot
    v-model:open="open"
    :model-value="input"
    :class="cn('relative', props.rootClass)"
    ignore-filter
  >
    <ComboboxAnchor as-child>
      <ComboboxInput
        ref="inputRef"
        v-model="input"
        v-bind="$attrs"
        :class="cn(
          `
            h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs
            transition-[color,box-shadow] outline-none
            placeholder:text-muted-foreground
            disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50
            md:text-sm
            dark:bg-input/30
          `,
          'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
          `
            aria-invalid:border-destructive aria-invalid:ring-destructive/20
            dark:aria-invalid:ring-destructive/40
          `,
          props.class,
        )"
        :auto-focus="autofocus"
        @focus="open = true"
        @input="syncCursor"
        @click="syncCursor"
        @keyup="syncCursor"
      />
      <X
        v-if="input.length > 0"
        class="
          absolute top-1/2 right-1 size-5 -translate-y-1/2 cursor-pointer text-muted-foreground
          hover:text-foreground
        "
        @click="input = ''"
      />
    </ComboboxAnchor>

    <ComboboxPortal>
      <ComboboxContent
        v-if="items.length > 0"
        class="
          z-50 mt-2 max-h-50 w-full min-w-(--reka-combobox-trigger-width) animate-in overflow-hidden rounded-md border
          bg-popover text-popover-foreground shadow-md fade-in-0 zoom-in-95
        "
        position="popper"
        align="start"
      >
        <ComboboxViewport>
          <ComboboxItem
            v-for="item in items"
            :key="item"
            :value="item"
            class="
              relative flex cursor-default items-center rounded-sm p-1 text-sm outline-none select-none
              data-disabled:pointer-events-none data-disabled:opacity-50
              data-highlighted:bg-accent data-highlighted:text-accent-foreground
            "
            @select.prevent="handleSelect(item)"
          >
            <slot name="item" :item="item">
              {{ item }}
            </slot>
          </ComboboxItem>
        </ComboboxViewport>
      </ComboboxContent>
    </ComboboxPortal>
  </ComboboxRoot>
</template>
