import type { SyncOp } from './types';
import type { PageItem } from '@/common/types';

/**
 * Apply ops in order to `base`, returning a new array on every step.
 */
export function replaySyncOps(base: PageItem[], ops: SyncOp[]): PageItem[] {
  let list = base;
  // A url update colliding at its op's position may free up later in the same
  // batch (the url owner is removed or renamed). So rejected url updates are
  // re-validated once after the whole batch.
  const deferredUrlUpdates: Array<{ id: string; url: string }> = [];

  for (const op of ops) {
    switch (op.t) {
      case 'add': {
        if (list.some(item => item.id === op.item.id || item.info.url === op.item.info.url))
          break;
        list = [op.item, ...list];
        break;
      }
      case 'remove': {
        list = list.filter(item => item.id !== op.id);
        break;
      }
      case 'update': {
        const idx = list.findIndex(item => item.id === op.id);
        if (idx === -1)
          break;
        const item = list[idx];
        const next: PageItem = { ...item, info: { ...item.info }, tags: [...item.tags] };
        const patch = op.patch;
        if (patch.title !== undefined)
          next.info.title = patch.title;
        if (patch.tags !== undefined)
          next.tags = patch.tags;
        if (patch.desc !== undefined)
          next.desc = patch.desc;
        if (patch.url !== undefined) {
          if (!list.some(other => other.id !== op.id && other.info.url === patch.url))
            next.info.url = patch.url;
          else
            deferredUrlUpdates.push({ id: op.id, url: patch.url });
        }
        if (patch.favorited !== undefined)
          next.favorited = patch.favorited;
        if (patch.updatedAt !== undefined)
          next.updatedAt = patch.updatedAt;
        list = [...list.slice(0, idx), next, ...list.slice(idx + 1)];
        break;
      }
      case 'moveToTop': {
        const idx = list.findIndex(item => item.id === op.id);
        if (idx === -1)
          break;
        const [item] = list.slice(idx, idx + 1);
        list = [item, ...list.slice(0, idx), ...list.slice(idx + 1)];
        break;
      }
    }
  }

  // Final pass: apply deferred url updates whose owner is gone by now.
  for (const { id, url } of deferredUrlUpdates) {
    if (list.some(item => item.id !== id && item.info.url === url))
      continue;
    const idx = list.findIndex(item => item.id === id);
    if (idx === -1)
      continue;
    const item = list[idx];
    const next: PageItem = { ...item, info: { ...item.info } };
    next.info.url = url;
    list = [...list.slice(0, idx), next, ...list.slice(idx + 1)];
  }

  return list;
}
