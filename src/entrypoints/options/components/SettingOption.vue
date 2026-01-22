<script setup lang="ts">
defineProps<{
  label: string;
  description: string;
}>();
</script>

<template>
  <div
    class="
      flex items-center justify-between p-4 transition-colors
      hover:bg-muted/50
    "
  >
    <div class="space-y-0.5">
      <Label class="text-base"> {{ label }} </Label>
      <p class="text-sm text-muted-foreground">
        {{ description }}
      </p>
    </div>

    <slot />
  </div>
</template>
