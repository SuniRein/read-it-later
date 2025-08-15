import { watchDeep } from '@vueuse/core';
import { ref } from 'vue';

import { deepToRaw } from '@/utils/object';
import store from '@/utils/store';

export async function useSetting() {
    const setting = ref(await store.setting.getValue());

    watchDeep(setting, newValue => store.setting.setValue(deepToRaw(newValue)));

    return { setting };
}
