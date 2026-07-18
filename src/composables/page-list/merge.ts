import type { PageLoadResult } from './types';
import type { PageItem } from '@/common/types';

export function computeMergeResult(
  existing: PageItem[],
  incoming: PageItem[],
): PageLoadResult {
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
