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

function deepToRaw<T>(value: T): T {
    if (Array.isArray(value)) {
        return value.map(deepToRaw) as unknown as T;
    } else if (value && typeof value === 'object') {
        const rawObject: Record<string, any> = {};
        for (const key in value) {
            rawObject[key] = deepToRaw(value[key]);
        }
        return rawObject as T;
    }
    return toRaw(value);
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
