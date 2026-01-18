import type { storage } from '#imports';
import { tryOnMounted, tryOnUnmounted } from '@vueuse/core';
import { shallowRef, watch } from 'vue';

import { deepToRaw } from '@/utils/object';

interface StorageMeta {
    lastModified?: number;
}

async function getMeta(store: ReturnType<typeof storage.defineItem<any>>) {
    return (await store.getMeta()) as StorageMeta;
}

export function useStoredValue<T>(store: ReturnType<typeof storage.defineItem<T>>) {
    const state = shallowRef<T>(store.fallback);

    let lastModified: number | undefined;

    let unwatchStore: null | (() => void) = null;
    let unwatchRef: null | (() => void) = null;

    tryOnMounted(async () => {
        state.value = structuredClone(await store.getValue());
        lastModified = (await getMeta(store)).lastModified;

        unwatchStore = store.watch(async (newValue) => {
            const remoteLastModified = (await getMeta(store)).lastModified;
            if (lastModified === undefined || (remoteLastModified !== undefined && remoteLastModified > lastModified)) {
                lastModified = remoteLastModified;
                state.value = structuredClone(newValue);
            }
        });

        unwatchRef = watch(
            state,
            async (newValue: T) => {
                lastModified = Date.now();
                await store.setMeta({ lastModified });
                await store.setValue(deepToRaw(newValue));
            },
        );
    });

    tryOnUnmounted(() => {
        unwatchStore?.();
        unwatchRef?.();
    });

    return state;
}
