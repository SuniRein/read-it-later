import { ref, onMounted } from 'vue';

import store from '@/utils/store';
import type { Setting } from '@/utils/types';
import { deepToRaw } from '@/utils/object';

export function useSetting() {
    const setting = ref<Setting>(store.setting.fallback);

    onMounted(() => reset());

    async function reset() {
        setting.value = structuredClone(await store.setting.getValue());
    }

    async function save() {
        await store.setting.setValue(deepToRaw(setting.value));
    }

    return {
        setting,
        save,
        reset,
    };
}
