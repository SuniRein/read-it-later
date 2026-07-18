import type { StorageItems } from '@/storage';

export const IsDarkKey = Symbol('isDark') as InjectionKey<Ref<boolean>>;
export const StorageItemsKey = Symbol('storageItems') as InjectionKey<StorageItems>;
