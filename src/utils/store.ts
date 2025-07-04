import { storage } from '#imports';
import { ref, computed, onMounted, onUnmounted } from 'vue';

import type { PageItem } from '@/utils/types';

export function useStoredValue<T>(store: ReturnType<typeof storage.defineItem<T>>, defaultValue: NonNullable<T>) {
    const state = ref<NonNullable<T>>(defaultValue);

    const unwatch = store.watch(async (newValue) => {
        state.value = newValue ?? defaultValue;
    });

    onMounted(async () => {
        const initialValue = await store.getValue();
        state.value = initialValue ?? defaultValue;
    });

    onUnmounted(() => {
        unwatch();
    });

    return computed({
        get() {
            return state.value;
        },
        set(newValue) {
            void store.setValue(newValue);
            state.value = newValue;
        },
    });
}

export const pageList = storage.defineItem<PageItem[]>('local:pageList');
export function usePageList() {
    return useStoredValue(pageList, []);
}
