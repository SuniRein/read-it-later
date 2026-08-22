import type { ShallowRef } from 'vue';
import type { PageLoadResult, PageUpdateInfo } from './types';
import type { PageInfo, PageItem, PageItemIMP } from '@/common/types';
import type { SyncLogCallback } from '@/services/sync/types';
import { nanoid } from 'nanoid';
import { mapIMPToPageItems } from './imp';
import { computeMergeResult } from './merge';

/**
 * Replace a page item by id with a mutated copy, then reassign the ShallowRef.
 * ShallowRef only fires effects on `.value` reassignment, not on in-place
 * mutation, so consumers downstream of `pageList` (computed filters,
 * pagination slices, etc.) actually re-evaluate.
 * Returns the updated item, or null if the item was not found.
 */
function mutate(
  pageList: ShallowRef<PageItem[]>,
  id: string,
  fn: (item: PageItem) => void,
): PageItem | null {
  const idx = pageList.value.findIndex(it => it.id === id);
  if (idx === -1)
    return null;
  const item = pageList.value[idx];
  const next: PageItem = { ...item, info: { ...item.info }, tags: [...item.tags] };
  fn(next);
  next.updatedAt = new Date().toISOString();
  pageList.value = [
    ...pageList.value.slice(0, idx),
    next,
    ...pageList.value.slice(idx + 1),
  ];
  return next;
}

export function createPageActions(
  pageList: ShallowRef<PageItem[]>,
  removedPageList: ShallowRef<PageItem[]>,
  logOp?: SyncLogCallback,
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
    logOp?.({ t: 'add', item: pageItem });
    return true;
  }

  function remove(id: string) {
    const idx = pageList.value.findIndex(item => item.id === id);
    if (idx !== -1) {
      const [removedItem] = pageList.value.slice(idx, idx + 1);
      removedPageList.value = [...removedPageList.value, removedItem];
      pageList.value = [
        ...pageList.value.slice(0, idx),
        ...pageList.value.slice(idx + 1),
      ];
      logOp?.({ t: 'remove', id });
    }
  }

  function update(id: string, info: PageUpdateInfo) {
    const next = mutate(pageList, id, (item) => {
      item.info.title = info.title ?? item.info.title;
      item.tags = info.tags ?? item.tags;
      item.desc = info.desc ?? item.desc;
    });
    if (next)
      logOp?.({ t: 'update', id, patch: { ...info, updatedAt: next.updatedAt } });
  }

  function updateTitle(id: string, newTitle: string) {
    const next = mutate(pageList, id, item => item.info.title = newTitle);
    if (next)
      logOp?.({ t: 'update', id, patch: { title: newTitle, updatedAt: next.updatedAt } });
  }

  function updateUrl(id: string, newUrl: string): boolean {
    if (pageList.value.some(item => item.info.url === newUrl))
      return false;
    const next = mutate(pageList, id, item => item.info.url = newUrl);
    if (next)
      logOp?.({ t: 'update', id, patch: { url: newUrl, updatedAt: next.updatedAt } });
    return next !== null;
  }

  function toggleFavorite(id: string) {
    const next = mutate(pageList, id, item => item.favorited = !item.favorited);
    if (next)
      logOp?.({ t: 'update', id, patch: { favorited: next.favorited, updatedAt: next.updatedAt } });
  }

  function moveToTop(id: string) {
    const idx = pageList.value.findIndex(item => item.id === id);
    if (idx !== -1) {
      const [item] = pageList.value.splice(idx, 1);
      pageList.value = [item, ...pageList.value];
      logOp?.({ t: 'moveToTop', id });
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
    [...data.added].reverse().forEach(item => logOp?.({ t: 'add', item }));
    data.updated.forEach(item =>
      logOp?.({
        t: 'update',
        id: item.id,
        // url is omitted: replay rejects url changes that collide with other
        // items, which would silently revert the import after sync; url
        // changes must go through updateUrl's collision-aware path.
        patch: { title: item.info.title, tags: item.tags, desc: item.desc, favorited: item.favorited, updatedAt: item.updatedAt },
      }),
    );
  }

  function clear() {
    const items = pageList.value;
    pageList.value = [];
    removedPageList.value = [];
    if (items.length > 0)
      logOp?.(items.map(item => ({ t: 'remove', id: item.id })));
  }

  const restorableItemCount = computed(() => removedPageList.value.length);

  function restoreRemoved() {
    const last = removedPageList.value.at(-1);
    if (last) {
      removedPageList.value = removedPageList.value.slice(0, -1);
      pageList.value = [last, ...pageList.value];
      logOp?.({ t: 'add', item: last });
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
