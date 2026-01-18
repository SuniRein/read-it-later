import { computed, shallowRef } from 'vue';

import store from '@/utils/store';

export function handleSetting() {
  const setting = shallowRef(store.setting.fallback);
  void store.setting.getValue().then(value => setting.value = value);
  store.setting.watch(value => setting.value = value);

  return {
    showBadge: computed(() => setting.value.showBadge),
    faviconCaching: computed(() => setting.value.faviconCaching),
    duplicatedUrlOpened: computed(() => setting.value.duplicatedUrlOpened),
  };
}
