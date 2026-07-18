import type { ShallowRef } from 'vue';
import type { PageLoadResult, PageUpdateInfo } from './types';
import type { PageInfo, PageItem, PageItemIMP } from '@/common/types';
import { nanoid } from 'nanoid';
import { triggerRef } from 'vue';
import { mapIMPToPageItems } from './imp';
import { computeMergeResult } from './merge';

/**
 * In-place mutate a page item, then trigger the ShallowRef.
 * Returns false if the item was not found.
 */
function mutate(
  pageList: ShallowRef<PageItem[]>,
  id: string,
  fn: (item: PageItem) => void,
): boolean {
  const item = pageList.value.find(it => it.id === id);
  if (!item)
    return false;
  fn(item);
  item.updatedAt = new Date().toISOString();
  triggerRef(pageList);
  return true;
}

export function createPageActions(
  pageList: ShallowRef<PageItem[]>,
  removedPageList: ShallowRef<PageItem[]>,
) {
  function add(info: PageInfo): boolean {
    if (pageList.value.some(item => item.info.url === info.url))
      return false; // Duplicate URL, do not add

    // Remove from removedPageList if it exists
    removedPageList.value = removedPageList.value.filter(item => item.info.url !== info.url);

    const now = new Date().toISOString();
    const pageItem: PageItem = {
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
    mutate(pageList, id, (item) => {
      item.info.title = info.title ?? item.info.title;
      item.tags = info.tags ?? item.tags;
      item.desc = info.desc ?? item.desc;
    });
  }

  function updateTitle(id: string, newTitle: string) {
    mutate(pageList, id, item => item.info.title = newTitle);
  }

  function updateUrl(id: string, newUrl: string): boolean {
    if (pageList.value.some(item => item.info.url === newUrl))
      return false;
    return mutate(pageList, id, item => item.info.url = newUrl);
  }

  function toggleFavorite(id: string) {
    mutate(pageList, id, item => item.favorited = !item.favorited);
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
