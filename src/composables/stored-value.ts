import type { WxtStorageItem } from '@/storage/reactive';
import { bindStorageItem } from '@/storage/reactive';

/**
 * Bind a wxt storage item to a ShallowRef, wired to component lifecycle.
 *
 * Initialisation and teardown are handled via `tryOnMounted` / `tryOnUnmounted`.
 * For environment-agnostic use (e.g. background scripts), call
 * {@link bindStorageItem} directly and manage `dispose` yourself.
 */
export function useStoredValue<T>(store: WxtStorageItem<T>) {
  const bound = bindStorageItem(store);
  tryOnMounted(() => void bound.ready);
  tryOnUnmounted(() => bound.dispose());
  return bound.value;
}
