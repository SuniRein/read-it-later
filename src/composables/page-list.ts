import type { PageInfo, PageItem } from '@/utils/types';

import { nanoid } from 'nanoid';

import { useStoredValue } from '@/composables/store';
import store from '@/utils/store';

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

  function update(id: string, newTitle: string, newTags: string[]) {
    const item = pageList.value.find(item => item.id === id);
    if (item) {
      item.info.title = newTitle;
      item.tags = newTags;
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

  function load(data: PageItem[]) {
    const existingIds = new Set(pageList.value.map(item => item.id));
    const existingUrls = new Set(pageList.value.map(item => item.info.url));

    const newItems = data.filter(item => !existingIds.has(item.id) && !existingUrls.has(item.info.url));
    pageList.value = [...newItems, ...pageList.value];
    return newItems.length;
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
    load,
    clear,

    restorableItemCount,
    restoreRemoved,
  };
}
