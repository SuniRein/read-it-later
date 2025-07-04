import { storage } from '#imports';
import { ref, watch, onMounted, onUnmounted } from 'vue';

import type { PageItem } from '@/utils/types';

// TODO: now only update the store when the ref changes, buf not update the ref when the store changes.
function storeToRef<T>(store: ReturnType<typeof storage.defineItem<T>>, defaultValue: NonNullable<T>) {
    const refValue = ref<NonNullable<T>>(defaultValue);

    const unwatchRef = watch(
        refValue,
        async (newValue) => {
            await store.setValue(newValue);
        },
        { deep: true },
    );

    onMounted(async () => {
        const initialValue = await store.getValue();
        if (initialValue) {
            refValue.value = initialValue;
        }
    });

    onUnmounted(() => {
        unwatchRef();
    });

    return refValue;
}

export const pageList = storage.defineItem<PageItem[]>('local:pageList');
export function usePageList() {
    return storeToRef(pageList, []);
}
