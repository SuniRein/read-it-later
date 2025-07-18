import type { storage } from '#imports';
import { onMounted, onUnmounted, ref, watch } from 'vue';

import { deepEqual, deepToRaw } from '@/utils/object';

export function useStoredValue<T>(store: ReturnType<typeof storage.defineItem<T>>) {
    const state = ref<T>(store.fallback);

    let unwatchStore: null | (() => void) = null;
    let unwatchRef: null | (() => void) = null;

    onMounted(async () => {
        state.value = structuredClone(await store.getValue());

        unwatchStore = store.watch(async (newValue) => {
            if (deepEqual(newValue, state.value))
                return;
            state.value = structuredClone(newValue);
        });

        unwatchRef = watch(
            state,
            (newValue) => {
                void store.setValue(deepToRaw(newValue));
            },
            { deep: true },
        );
    });

    onUnmounted(() => {
        unwatchStore?.();
        unwatchRef?.();
    });

    return state;
}
