import { computed, shallowRef } from 'vue';

import store from '@/utils/store';

export function handleSetting() {
    const setting = shallowRef(store.setting.fallback);
    store.setting.getValue().then(value => setting.value = value);
    store.setting.watch(value => setting.value = value);

    return {
        showBadge: computed(() => setting.value.showBadge),
        duplicatedUrlOpened: computed(() => setting.value.duplicatedUrlOpened),
    };
}
