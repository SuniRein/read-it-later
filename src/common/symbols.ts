import type { PageItem, Tab } from '@/common/types';
import type { usePageListContext } from '@/composables/page-list';
import type { StorageItems } from '@/storage';

export type PopupContextValue = ReturnType<typeof usePageListContext> & {
  currentTab: Ref<Tab | null>;
  displayedList: ComputedRef<PageItem[]>;
  pageTags: ComputedRef<string[]>;
  isPopout: boolean;
};

export const PopupContextKey: InjectionKey<PopupContextValue> = Symbol('popupContext');

export const IsDarkKey = Symbol('isDark') as InjectionKey<Ref<boolean>>;
export const StorageItemsKey = Symbol('storageItems') as InjectionKey<StorageItems>;
