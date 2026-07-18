import type { StorageItems } from '@/storage';
import { deepToRaw } from '@/common/object';

/**
 * Reactive binding for the user `setting` store item.
 *
 * `setting` is a deep `Ref<Setting>` — assignments to nested properties
 * propagate to persistence directly, no form bridge required.
 *
 * `ready` resolves after the initial persisted value is loaded; `await` it
 * before mounting UI that must never show the fallback value.
 */
export function useSettings(items: Pick<StorageItems, 'setting'>) {
  const store = items.setting;
  const setting = ref(structuredClone(store.fallback));

  let remoteSync = false;

  const ready = (async () => {
    setting.value = structuredClone(await store.getValue());
  })();

  store.watch((_newValue) => {
    remoteSync = true;
    setting.value = structuredClone(_newValue);
    void nextTick(() => {
      remoteSync = false;
    });
  });

  watchDeep(setting, async (newValue) => {
    if (remoteSync)
      return;
    await store.setValue(deepToRaw(newValue));
  });

  return {
    /** Deep Ref — mutate nested properties directly for persistence. */
    setting,
    /** Promise that resolves after the persisted value is loaded. */
    ready,

    colorMode: computed(() => setting.value.colorMode),
    locale: computed(() => setting.value.locale),
    fontSize: computed(() => setting.value.fontSize),
    showBadge: computed(() => setting.value.showBadge),
    faviconCaching: computed(() => setting.value.faviconCaching),
    faviconSource: computed(() => setting.value.faviconSource),
    pagination: computed(() => setting.value.pagination),
    duplicatedUrlOpened: computed(() => setting.value.duplicatedUrlOpened),
    randomPageIgnoreOpened: computed(() => setting.value.randomPageIgnoreOpened),
    openAndRemove: computed(() => setting.value.openAndRemove),
    addAndClose: computed(() => setting.value.addAndClose),
  };
}
