<script setup lang="ts">
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from 'lucide-vue-next';

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

    <Pagination
      v-model:page="page"
      :total="total"
      :items-per-page="itemsPerPage"
      :sibling-count="0"
      show-edges
    >
      <PaginationContent v-slot="{ items: pageItems }" class="flex items-center gap-1">
        <PaginationFirst><ChevronFirst /></PaginationFirst>
        <PaginationPrevious><ChevronLeft /></PaginationPrevious>

        <template v-for="(item, index) in pageItems">
          <PaginationItem
            v-if="item.type === 'page'"
            :key="index"
            :value="item.value"
            :is-active="item.value === page"
          >
            {{ item.value }}
          </PaginationItem>
          <PaginationEllipsis v-else :key="item.type" :index="index" />
        </template>

        <PaginationNext><ChevronRight /></PaginationNext>
        <PaginationLast><ChevronLast /></PaginationLast>
      </PaginationContent>
    </Pagination>
  </footer>
</template>
