import type { ShallowRef } from 'vue';
import type { PageLoadResult, PageUpdateInfo } from './types';
import type { PageInfo, PageItem, PageItemIMP } from '@/common/types';
import type { SyncLogCallback, SyncOp } from '@/services/sync/types';
import { nanoid } from 'nanoid';
import { MAX_ARCHIVED_PAGES } from '@/storage';
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
  archivedPageList: ShallowRef<PageItem[]>,
  logOp?: SyncLogCallback,
) {
  /** Append to the archive and drop the oldest entries past MAX_ARCHIVED_PAGES. */
  function archivePages(items: PageItem[]) {
    if (items.length === 0)
      return;
    // Callers pass page-list order (newest first); the archive stores oldest
    // first, so trimming the head and the reversed archive view agree on age.
    const next = [...archivedPageList.value, ...[...items].reverse()];
    archivedPageList.value = next.length > MAX_ARCHIVED_PAGES
      ? next.slice(next.length - MAX_ARCHIVED_PAGES)
      : next;
  }

  function add(info: PageInfo): boolean {
    if (pageList.value.some(item => item.info.url === info.url))
      return false; // Duplicate URL, do not add

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
      archivePages([removedItem]);
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
    archivedPageList.value = [];
    if (items.length > 0)
      logOp?.(items.map(item => ({ t: 'remove', id: item.id })));
  }

  /**
   * Overwrite the whole list (e.g. with a cloud sync result). Items missing
   * from `next` are moved to archivedPageList. Not logged.
   */
  function overwrite(next: PageItem[]) {
    const nextIds = new Set(next.map(item => item.id));
    const dropped = pageList.value.filter(item => !nextIds.has(item.id));
    pageList.value = next;
    archivePages(dropped);
  }

  /** The list entry that collides with an archived page, if any. */
  function findArchivedConflict(id: string): PageItem | undefined {
    const item = archivedPageList.value.find(it => it.id === id);
    if (item === undefined)
      return undefined;
    return pageList.value.find(it => it.id === item.id || it.info.url === item.info.url);
  }

  /**
   * Restore one archived page to the top of the list. Returns false when the id
   * is not archived, or when the list already holds the page and `mode` is
   * 'keep'.
   *
   * 'keep' changes nothing — the archive record stays so the conflict remains
   * visible. 'overwrite' replaces the existing entry with the archived version,
   * which is the only place duplicate URLs get resolved.
   */
  function restoreArchivedPage(id: string, mode: 'overwrite' | 'keep' = 'keep'): boolean {
    const item = archivedPageList.value.find(it => it.id === id);
    if (item === undefined)
      return false;

    const conflicts = pageList.value.filter(it => it.id === item.id || it.info.url === item.info.url);
    if (conflicts.length > 0 && mode === 'keep')
      return false;

    archivedPageList.value = archivedPageList.value.filter(it => it.id !== id);
    if (conflicts.length === 0) {
      pageList.value = [item, ...pageList.value];
      logOp?.({ t: 'add', item });
      return true;
    }

    const conflictIds = new Set(conflicts.map(it => it.id));
    pageList.value = [item, ...pageList.value.filter(it => !conflictIds.has(it.id))];
    logOp?.([
      ...conflicts.map((it): SyncOp => ({ t: 'remove', id: it.id })),
      { t: 'add', item },
    ]);
    return true;
  }

  /** Permanently drop one archived page. Local only: not logged. */
  function deleteArchivedPage(id: string) {
    archivedPageList.value = archivedPageList.value.filter(it => it.id !== id);
  }

  /** Permanently drop every archived page. Local only: not logged. */
  function clearArchivedPages() {
    archivedPageList.value = [];
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
    overwrite,
    tryLoad,
    tryLoadFromIMP,
    load,
    restoreArchivedPage,
    findArchivedConflict,
    deleteArchivedPage,
    clearArchivedPages,
  };
}
