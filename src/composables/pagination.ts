export function usePagination<T>(source: Ref<readonly T[]>, pageSize: MaybeRef<number>) {
  const current = ref(1);

  const pageSlice = computed(() => {
    const start = (current.value - 1) * unref(pageSize);
    return source.value.slice(start, start + unref(pageSize));
  });

  function goto(page: number) {
    current.value = Math.max(1, Math.min(page, Math.ceil(source.value.length / unref(pageSize))));
  }

  return { current, pageSlice, goto };
}
