<script setup lang="ts">
const props = defineProps<{ tag: string }>();

const COLOR_MAP = [
  'bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-400',
  'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400',
  'bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-400',
  'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400',
  'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400',
  'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400',
  'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/40 dark:text-slate-400',
  'bg-lime-100 text-lime-700 border-lime-200 dark:bg-lime-900/30 dark:text-lime-400',
  'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400',
  'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400',
  'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400',
  'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400',
];

function hashString(str: string): number {
  return Math.abs(Array.from(str)
    .reduce((hash, char) => (hash << 5) - hash + char.charCodeAt(0), 0),
  );
}

const tagColor = computed(() => {
  const index = hashString(props.tag) % COLOR_MAP.length;
  return COLOR_MAP[index];
});
</script>

<template>
  <Badge variant="outline" :class="cn('border px-1.5 py-0 text-sm font-medium tracking-wider', tagColor)">
    {{ tag }}
  </Badge>
</template>
