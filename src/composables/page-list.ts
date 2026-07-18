import type { PageInfo, PageItem, PageItemIMP } from '@/common/types';
import type { StorageItems } from '@/storage';
import { nanoid } from 'nanoid';
import { useStoredValue } from '@/composables/stored-value';
import { mapIMPToPageItems } from '@/services/serialization';

export interface PageUpdateInfo {
  title?: string;
  tags?: string[];
  desc?: string;
}

export function usePageList(items: Pick<StorageItems, 'pageList' | 'removedPageList'>) {
  const pageList = useStoredValue(items.pageList);
  const removedPageList = useStoredValue(items.removedPageList);

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
    return computeMergeResult(pageList.value, data);
  }

  function tryLoadFromIMP(data: PageItemIMP[]) {
    return computeMergeResult(pageList.value, mapIMPToPageItems(data));
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

export interface PageLoadResult {
  added: PageItem[];
  updated: PageItem[];
  ignored: PageItem[];
  conflicted: PageItem[];
}

function computeMergeResult(existing: PageItem[], incoming: PageItem[]): PageLoadResult {
  const result: PageLoadResult = { added: [], updated: [], ignored: [], conflicted: [] };

  const idMap = new Map(existing.map(item => [item.id, item]));
  const urlMap = new Map(existing.map(item => [item.info.url, item]));

  const remaining = incoming.filter((item) => {
    const old = idMap.get(item.id);
    if (!old)
      return true;

    if (item.updatedAt > old.updatedAt) {
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

  for (const item of remaining) {
    (urlMap.has(item.info.url) ? result.conflicted : result.added).push(item);
  }

  return result;
}
