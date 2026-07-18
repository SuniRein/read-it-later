import type { StorageItems } from '@/storage';
import { deepToRaw } from '@/common/object';

let _instance: ReturnType<typeof createSettingsInstance> | null = null;

/** Exposed only for test teardown. */
export function resetSettingsInstance(): void {
  _instance = null;
}

/**
 * Lazy singleton. Provide `items` on the first call; subsequent calls
 * ignore the argument and return the cached instance.
 */
export function useSettings(items?: Pick<StorageItems, 'setting'>) {
  if (_instance)
    return _instance;

  if (!items)
    throw new Error('useSettings: must provide items on first call');

  _instance = createSettingsInstance(items);
  return _instance;
}

function createSettingsInstance(items: Pick<StorageItems, 'setting'>) {
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
    setting,
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
