import type { ShallowRef } from 'vue';
import { shallowRef, watch } from 'vue';
import { deepToRaw } from '@/common/object';

interface StorageMeta {
  lastModified?: number;
}

export type WxtStorageItem<T> = ReturnType<typeof storage.defineItem<T>>;

export interface BoundStore<T> {
  /** The reactive ref — reads are synchronous, writes are persisted. */
  value: ShallowRef<T>;
  /** Resolves after the initial `getValue()` completes. */
  ready: Promise<void>;
  /** Unwatch both store and ref listeners. Safe to call before `ready` resolves. */
  dispose: () => void;
}

/**
 * Bind a wxt storage item to a ShallowRef without coupling to Vue lifecycle.
 *
 * The initial read starts immediately — `await ready` before relying on
 * the value to avoid seeing the fallback.  Watchers are registered inside
 * `ready` so the first `getValue()` completes before any remote-update
 * callback can interleave.
 *
 * The local ref writes back via `watch` with `meta.lastModified` for
 * concurrency tracking.  Call `dispose` when the consumer is done.
 */
export function bindStorageItem<T>(store: WxtStorageItem<T>): BoundStore<T> {
  if (store.fallback === null) {
    throw new Error(
      'bindStorageItem requires a fallback value in the storage item definition.',
    );
  }

  const state = shallowRef<T>(structuredClone(store.fallback));
  let lastModified: number | undefined;
  let unwatchStore: (() => void) | undefined;
  let unwatchRef: (() => void) | undefined;

  const ready = (async () => {
    state.value = structuredClone(await store.getValue());
    lastModified = ((await store.getMeta()) as StorageMeta).lastModified;

    unwatchStore = store.watch(async (newValue) => {
      const remoteLastModified = ((await store.getMeta()) as StorageMeta)
        .lastModified;
      if (
        lastModified === undefined
        || (remoteLastModified !== undefined
          && remoteLastModified > lastModified)
      ) {
        lastModified = remoteLastModified;
        state.value = structuredClone(newValue);
      }
    });

    unwatchRef = watch(state, async (newValue: T) => {
      lastModified = Date.now();
      await store.setMeta({ lastModified });
      await store.setValue(deepToRaw(newValue));
    });
  })();

  return {
    value: state,
    ready,
    dispose: () => {
      unwatchStore?.();
      unwatchRef?.();
    },
  };
}
