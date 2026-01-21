<script setup lang="ts" generic="T extends { value: string }">
import { X } from 'lucide-vue-next';
import { ComboboxAnchor, ComboboxContent, ComboboxInput, ComboboxItem, ComboboxPortal, ComboboxRoot, ComboboxViewport } from 'reka-ui';

defineProps<{
  items: T[];
  placeholder?: string;
  autofocus?: boolean;
}>();

const emit = defineEmits<{
  select: [item: T];
}>();

const input = defineModel<string>({ default: '' });
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
  <ComboboxRoot v-model:open="open" class="relative" ignore-filter>
    <ComboboxAnchor as-child>
      <div class="relative">
        <ComboboxInput
          ref="inputRef"
          v-model="input"
          class="
            flex w-full rounded-md border bg-background px-2 py-1 text-lg
            focus:ring-1 focus:ring-ring focus:outline-none
            disabled:cursor-not-allowed disabled:opacity-50
          "
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
      </div>
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
