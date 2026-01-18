<script setup lang="ts">
defineProps<{
  title: string;
  icon: Component;
}>();
</script>

<template>
  <section class="space-y-2">
    <div class="flex items-center gap-2 px-1">
      <component :is="icon" class="size-5 text-primary" />
      <h3 class="text-lg font-medium">
        {{ title }}
      </h3>
    </div>

    <Card class="p-1">
      <CardContent class="p-0">
        <slot />
      </CardContent>
    </Card>
  </section>
</template>
