<script setup lang="ts">
const { total, itemsPerPage } = defineProps<{ total: number; itemsPerPage: number }>();
const page = defineModel<number>('page', { required: true });
</script>

<template>
  <footer
    class="flex items-center justify-between border-t border-sidebar-border bg-card px-2 py-1.5 text-card-foreground"
  >
    <Badge
      variant="outline" class="
        rounded-full bg-green-600/10 font-mono font-bold text-green-600
        dark:bg-green-400/10 dark:text-green-400
      "
    >
      {{ total }}
    </Badge>

    <PaginationBar v-model:page="page" :total="total" :items-per-page="itemsPerPage" />
  </footer>
</template>
