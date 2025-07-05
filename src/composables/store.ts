import { storage } from '#imports';
import { ref, watch, toRaw, onMounted, onUnmounted } from 'vue';

function deepEqual(a: any, b: any): boolean {
    if (a === b) return true;
    if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;

    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) {
        if (!keysB.includes(key) || !deepEqual(a[key], b[key])) return false;
    }

    return true;
}

export function useStoredValue<T>(store: ReturnType<typeof storage.defineItem<T>>, defaultValue: NonNullable<T>) {
    const state = ref<NonNullable<T>>(defaultValue);

    let unwatchStore: null | (() => void) = null;
    let unwatchRef: null | (() => void) = null;

    onMounted(async () => {
        const initialValue = await store.getValue();
        state.value = initialValue ?? defaultValue;

        unwatchStore = store.watch(async (newValue) => {
            if (deepEqual(newValue, state.value)) return;
            state.value = newValue ?? defaultValue;
        });

        unwatchRef = watch(
            state,
            (newValue) => {
                void store.setValue(toRaw(newValue));
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
