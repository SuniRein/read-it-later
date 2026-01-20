<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

const props = defineProps<{
  icon: Component;
  tip: string;
  disabled?: boolean;
  class?: HTMLAttributes['class'];
}>();

const emit = defineEmits<{
  click: [e: MouseEvent];
}>();
</script>

<template>
  <TooltipProvider :delay-duration="300">
    <Tooltip>
      <TooltipTrigger as-child>
        <Button
          variant="ghost"
          size="icon"
          :disabled
          :class="cn(`
            size-8 cursor-pointer text-zinc-400 transition-all
            hover:bg-white/10 hover:text-white
            active:scale-95
            disabled:opacity-30
          `, props.class)"
          @click="emit('click', $event)"
        >
          <component :is="icon" class="size-6" />
        </Button>
      </TooltipTrigger>
      <TooltipContent v-if="tip" side="bottom" align="end" class="text-lg">
        <p>{{ tip }}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
