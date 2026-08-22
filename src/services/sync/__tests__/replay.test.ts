import type { PageItem } from '@/common/types';
import type { SyncOp } from '@/services/sync/types';
import { describe, expect, it } from 'vitest';
import { replaySyncOps } from '@/services/sync/replay';

function createItem(id: string, url = `https://example.com/${id}`): PageItem {
  return {
    id,
    info: { title: `Page ${id}`, url },
    tags: [],
    desc: '',
    favorited: false,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  };
}

describe('replaySyncOps', () => {
  it('add prepends and is skipped on duplicate id or url', () => {
    const base = [createItem('a')];
    const ops: SyncOp[] = [
      { t: 'add', item: createItem('b') },
      { t: 'add', item: createItem('c', 'https://example.com/a') }, // dup url
      { t: 'add', item: createItem('a', 'https://example.com/x') }, // dup id
    ];
    const result = replaySyncOps(base, ops);
    expect(result.map(item => item.id)).toEqual(['b', 'a']);
  });

  it('remove filters by id and ignores missing ids', () => {
    const base = [createItem('a'), createItem('b'), createItem('c')];
    const ops: SyncOp[] = [
      { t: 'remove', id: 'b' },
      { t: 'remove', id: 'missing' },
    ];
    const result = replaySyncOps(base, ops);
    expect(result.map(item => item.id)).toEqual(['a', 'c']);
  });

  it('update applies present patch fields and skips missing ids', () => {
    const base = [createItem('a'), createItem('b')];
    const ops: SyncOp[] = [
      {
        t: 'update',
        id: 'a',
        patch: { title: 'Renamed', tags: ['t1'], desc: 'd', favorited: true, updatedAt: '2024-01-01T00:00:00Z' },
      },
      { t: 'update', id: 'missing', patch: { title: 'x', updatedAt: '2024-01-01T00:00:00Z' } },
    ];
    const result = replaySyncOps(base, ops);
    const a = result.find(item => item.id === 'a')!;
    expect(a.info.title).toBe('Renamed');
    expect(a.tags).toEqual(['t1']);
    expect(a.desc).toBe('d');
    expect(a.favorited).toBe(true);
    expect(a.updatedAt).toBe('2024-01-01T00:00:00Z');
    expect(result).toHaveLength(2);
  });

  it('update keeps the old url when another item owns the new url', () => {
    const base = [createItem('a'), createItem('b')];
    const ops: SyncOp[] = [
      { t: 'update', id: 'a', patch: { url: 'https://example.com/b', updatedAt: '2024-01-01T00:00:00Z' } },
    ];
    const result = replaySyncOps(base, ops);
    expect(result.find(item => item.id === 'a')!.info.url).toBe('https://example.com/a');
  });

  it('update changes url when it is free', () => {
    const base = [createItem('a')];
    const ops: SyncOp[] = [
      { t: 'update', id: 'a', patch: { url: 'https://example.com/new', updatedAt: '2024-01-01T00:00:00Z' } },
    ];
    const result = replaySyncOps(base, ops);
    expect(result.find(item => item.id === 'a')!.info.url).toBe('https://example.com/new');
  });

  it('applies a deferred url update once the owner is removed later in the same batch, idempotently', () => {
    const base = [createItem('a'), createItem('b')];
    const ops: SyncOp[] = [
      { t: 'update', id: 'a', patch: { url: 'https://example.com/b', updatedAt: '2024-01-01T00:00:00Z' } },
      { t: 'remove', id: 'b' },
    ];
    const once = replaySyncOps(base, ops);
    expect(once.map(item => item.id)).toEqual(['a']);
    expect(once[0].info.url).toBe('https://example.com/b');
    const twice = replaySyncOps(once, ops);
    expect(twice).toEqual(once);
  });

  it('keeps the old url while the owner stays, idempotently', () => {
    const base = [createItem('a'), createItem('b')];
    const ops: SyncOp[] = [
      { t: 'update', id: 'a', patch: { url: 'https://example.com/b', updatedAt: '2024-01-01T00:00:00Z' } },
    ];
    const once = replaySyncOps(base, ops);
    expect(once.find(item => item.id === 'a')!.info.url).toBe('https://example.com/a');
    const twice = replaySyncOps(once, ops);
    expect(twice).toEqual(once);
  });

  it('update with tags=[] clears tags', () => {
    const base = [{ ...createItem('a'), tags: ['t1'] }];
    const ops: SyncOp[] = [{ t: 'update', id: 'a', patch: { tags: [], updatedAt: '2024-01-01T00:00:00Z' } }];
    const result = replaySyncOps(base, ops);
    expect(result.find(item => item.id === 'a')!.tags).toEqual([]);
  });

  it('moveToTop moves the item to the head and ignores missing ids', () => {
    const base = [createItem('a'), createItem('b'), createItem('c')];
    const ops: SyncOp[] = [
      { t: 'moveToTop', id: 'c' },
      { t: 'moveToTop', id: 'missing' },
    ];
    const result = replaySyncOps(base, ops);
    expect(result.map(item => item.id)).toEqual(['c', 'a', 'b']);
  });

  it('add then remove then add again restores the item at the head', () => {
    const base = [createItem('a')];
    const ops: SyncOp[] = [
      { t: 'add', item: createItem('b') },
      { t: 'remove', id: 'b' },
      { t: 'add', item: createItem('b') },
    ];
    const result = replaySyncOps(base, ops);
    expect(result.map(item => item.id)).toEqual(['b', 'a']);
  });

  it('is idempotent: replaying the same ops twice equals replaying once', () => {
    const base = [createItem('a'), createItem('b')];
    const ops: SyncOp[] = [
      { t: 'add', item: createItem('c') },
      { t: 'update', id: 'a', patch: { title: 'Renamed', tags: ['t'], updatedAt: '2024-01-01T00:00:00Z' } },
      { t: 'moveToTop', id: 'b' },
      { t: 'remove', id: 'c' },
    ];
    const once = replaySyncOps(base, ops);
    const twice = replaySyncOps(once, ops);
    expect(twice).toEqual(once);
  });
});
