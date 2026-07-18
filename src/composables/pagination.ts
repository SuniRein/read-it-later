export function usePagination<T>(source: Ref<readonly T[]>, pageSize: Ref<number>) {
  const current = ref(1);

  const pageSlice = computed(() => {
    const start = (current.value - 1) * pageSize.value;
    return source.value.slice(start, start + pageSize.value);
  });

  function goto(page: number) {
    current.value = Math.max(1, Math.min(page, Math.ceil(source.value.length / pageSize.value)));
  }

  return { current, pageSlice, goto };
}
