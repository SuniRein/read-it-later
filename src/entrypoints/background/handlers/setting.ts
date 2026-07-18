import type { StorageItems } from '@/storage';

export function handleSetting(items: Pick<StorageItems, 'setting'>) {
  const setting = shallowRef(items.setting.fallback);
  void items.setting.getValue().then(value => setting.value = value);
  items.setting.watch(value => setting.value = value);

  return {
    showBadge: computed(() => setting.value.showBadge),
    faviconCaching: computed(() => setting.value.faviconCaching),
    duplicatedUrlOpened: computed(() => setting.value.duplicatedUrlOpened),
    randomPageIgnoreOpened: computed(() => setting.value.randomPageIgnoreOpened),
    openAndRemove: computed(() => setting.value.openAndRemove),
    addAndClose: computed(() => setting.value.addAndClose),
  };
}
