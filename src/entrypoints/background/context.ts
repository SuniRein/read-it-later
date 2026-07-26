import type { NotifyFunction } from './modules/notify';
import type { PageItem, Tab } from '@/common/types';
import type { StorageItems } from '@/storage';
import { useSettings } from '@/app/settings';
import { usePageListContext } from '@/composables/page-list';

type PageListApi = ReturnType<typeof usePageListContext>;

export interface BackgroundContext {
  items: StorageItems;
  settings: ReturnType<typeof useSettings>;

  pages: {
    pageActions: PageListApi['pageActions'];
    pageMap: ComputedRef<Map<string, PageItem>>;
    pageListFiltered: ComputedRef<PageItem[]>;
  };

  isConnected: Readonly<Ref<boolean>>;
  currentTab: ShallowRef<Tab | null>;
  currentTabUrl: ComputedRef<string>;
  currentTabId: ComputedRef<number | null>;

  sendNotify: NotifyFunction;

  openPage: (url: string) => Promise<void>;
  openRandomPage: () => Promise<void>;
  addCurrentTab: () => Promise<void>;
  removeCurrentPage: () => void;
  toggleFavoriteCurrentPage: () => void;
}

export function createBackgroundContext(items: StorageItems): BackgroundContext {
  const settings = useSettings(items);
  const { pageActions, pageMap, pageListFiltered } = usePageListContext(items);
  // Other fields will be filled in by installXxx in the installation order;
  // cast to express "the interface is complete after construction".
  return {
    items,
    settings,
    pages: { pageActions, pageMap, pageListFiltered },
  } as BackgroundContext;
}
