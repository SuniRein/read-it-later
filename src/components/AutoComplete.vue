<script setup lang="ts" generic="T extends { value: string }">
import type { HTMLAttributes } from 'vue';
import { X } from 'lucide-vue-next';
import { ComboboxAnchor, ComboboxContent, ComboboxInput, ComboboxItem, ComboboxPortal, ComboboxRoot, ComboboxViewport } from 'reka-ui';

defineOptions({ inheritAttrs: false });

const props = defineProps<{
  items: T[];
  placeholder?: string;
  autofocus?: boolean;
  class?: HTMLAttributes['class'];
  rootClass?: HTMLAttributes['class'];
}>();

const emit = defineEmits<{
  select: [item: T];
}>();

const input = defineModel<string>({ required: true });
const cursor = defineModel<number>('cursor', { default: -1 });
const open = defineModel<boolean>('open', { default: false });

function syncCursor(e: Event) {
  const target = e.target as HTMLInputElement;
  cursor.value = target.selectionStart ?? -1;
}

const inputRef = useTemplateRef('inputRef');

function focus(newPos: number) {
  const inputEl = inputRef.value?.$el as HTMLInputElement | null;
  if (inputEl) {
    inputEl.focus();
    void nextTick(() => {
      inputEl.setSelectionRange(newPos, newPos);
      cursor.value = newPos;
    });
  }
}

defineExpose({ focus });
</script>

<template>
  <ComboboxRoot v-model:open="open" :model-value="input" :class="cn('relative', props.rootClass)" ignore-filter>
    <ComboboxAnchor as-child>
      <ComboboxInput
        ref="inputRef"
        v-bind="$attrs"
        v-model="input"
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
        :placeholder
        :auto-focus="autofocus"
        @input="syncCursor"
        @click="syncCursor"
        @keyup="syncCursor"
        @focus="open = true"
      />
      <X
        v-if="input.length > 0"
        class="
          absolute top-1/2 right-1 size-5 -translate-y-1/2 cursor-pointer text-muted-foreground
          hover:text-foreground
        "
        @click="input = ''; cursor = 0;"
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
            :key="item.value"
            :value="item.value"
            class="
              relative flex cursor-default items-center rounded-sm p-1 text-sm outline-none select-none
              data-disabled:pointer-events-none data-disabled:opacity-50
              data-highlighted:bg-accent data-highlighted:text-accent-foreground
            "
            @select.prevent="emit('select', item)"
          >
            <slot name="item" :item="item">
              {{ item.value }}
            </slot>
          </ComboboxItem>
        </ComboboxViewport>
      </ComboboxContent>
    </ComboboxPortal>
  </ComboboxRoot>
</template>
