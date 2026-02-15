import type { PageInfo, PageItem, PageItemIMP } from '@/utils/types';

import { nanoid } from 'nanoid';
import { useStoredValue } from '@/composables/store';
import store from '@/utils/store';

export interface PageUpdateInfo {
  title?: string;
  tags?: string[];
  desc?: string;
}

export interface PageLoadResult {
  added: PageItem[];
  updated: PageItem[];
  ignored: PageItem[];
  conflicted: PageItem[];
}

export function usePageList() {
  const pageList = useStoredValue(store.pageList);
  const removedPageList = useStoredValue(store.removedPageList);

  function add(info: PageInfo): boolean {
    if (pageList.value.some(item => item.info.url === info.url)) {
      return false; // Prevent adding duplicate pages
    }

    // Remove from removedPageList if it exists
    removedPageList.value = removedPageList.value.filter(item => item.info.url !== info.url);

    const now = new Date().toISOString();
    const pageItem = {
      id: nanoid(),
      info,
      tags: [],
      desc: '',
      favorited: false,
      createdAt: now,
      updatedAt: now,
    };
    pageList.value = [pageItem, ...pageList.value];
    return true;
  }

  function remove(id: string) {
    const idx = pageList.value.findIndex(item => item.id === id);
    if (idx !== -1) {
      const [removedItem] = pageList.value.splice(idx, 1);
      removedPageList.value = [...removedPageList.value, removedItem];
      triggerRef(pageList);
    }
  }

  function update(id: string, info: PageUpdateInfo) {
    const item = pageList.value.find(item => item.id === id);
    if (item) {
      item.info.title = info.title ?? item.info.title;
      item.tags = info.tags ?? item.tags;
      item.desc = info.desc ?? item.desc;
      item.updatedAt = new Date().toISOString();
      triggerRef(pageList);
    }
  }

  function updateTitle(id: string, newTitle: string) {
    const item = pageList.value.find(item => item.id === id);
    if (item) {
      item.info.title = newTitle;
      item.updatedAt = new Date().toISOString();
      triggerRef(pageList);
    }
  }

  function updateUrl(id: string, newUrl: string): boolean {
    if (pageList.value.some(item => item.info.url === newUrl)) {
      return false;
    }

    const item = pageList.value.find(item => item.id === id);
    if (item) {
      item.info.url = newUrl;
      item.updatedAt = new Date().toISOString();
      triggerRef(pageList);
    }
    return true;
  }

  function toggleFavorite(id: string) {
    const item = pageList.value.find(item => item.id === id);
    if (item) {
      item.favorited = !item.favorited;
      item.updatedAt = new Date().toISOString();
    }
    triggerRef(pageList);
  }

  function moveToTop(id: string) {
    const idx = pageList.value.findIndex(item => item.id === id);
    if (idx !== -1) {
      const [item] = pageList.value.splice(idx, 1);
      pageList.value = [item, ...pageList.value];
    }
  }

  // assume no duplicate IDs or URLs in the dataset
  function tryLoad(data: PageItem[]) {
    const result: PageLoadResult = { added: [], updated: [], ignored: [], conflicted: [] };

    const idMap = new Map(pageList.value.map(item => [item.id, item]));
    const urlMap = new Map(pageList.value.map(item => [item.info.url, item]));

    // First find updated and ignored
    const remainingData = data.filter((item) => {
      const old = idMap.get(item.id);
      if (!old)
        return true;

      if (item.updatedAt > old.updatedAt) {
        // update url map if item updated
        if (item.info.url !== old.info.url) {
          urlMap.delete(old.info.url);
          urlMap.set(item.info.url, item);
        }
        result.updated.push(item);
      }
      else {
        result.ignored.push(item);
      }
      return false;
    });

    // Then find added and conflicted
    remainingData.forEach((item) => {
      if (urlMap.has(item.info.url)) {
        result.conflicted.push(item);
      }
      else {
        result.added.push(item);
      }
    });

    return result;
  }

  function tryLoadFromIMP(data: PageItemIMP[]): PageLoadResult {
    const now = new Date().toISOString();
    const items = data.map(item => ({
      id: nanoid(),
      info: { title: item.title, url: item.url },
      tags: item.tags,
      desc: '',
      favorited: false,
      createdAt: now,
      updatedAt: now,
    }));

    const added: PageItem[] = [];
    const conflicted: PageItem[] = [];

    const urlSet = new Set(pageList.value.map(item => item.info.url));
    items.forEach(item => urlSet.has(item.info.url) ? conflicted.push(item) : added.push(item));

    return { added, conflicted, updated: [], ignored: [] };
  }

  // must be used immediately after `tryLoad` for data integrity
  function load(data: PageLoadResult) {
    const updatedItems = new Map(data.updated.map(item => [item.id, item]));
    pageList.value = pageList.value.map(item => updatedItems.get(item.id) ?? item);
    pageList.value = [...data.added, ...pageList.value];
  }

  function clear() {
    pageList.value = [];
    removedPageList.value = [];
  }

  const restorableItemCount = computed(() => removedPageList.value.length);

  function restoreRemoved() {
    const restoredItem = removedPageList.value.pop();
    if (restoredItem) {
      pageList.value = [restoredItem, ...pageList.value];
      triggerRef(removedPageList);
    }
  }

  return {
    pageList,
    add,
    remove,
    update,
    updateTitle,
    updateUrl,
    toggleFavorite,
    moveToTop,
    clear,

    tryLoad,
    tryLoadFromIMP,
    load,

    restorableItemCount,
    restoreRemoved,
  };
}
