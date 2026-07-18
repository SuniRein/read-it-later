import type { StorageItems } from '@/storage';
import { useStoredValue } from '@/composables/stored-value';

export function useSearchText(items: Pick<StorageItems, 'searchText'>) {
  const searchText = useStoredValue(items.searchText);
  const searchTextDebounced = refDebounced(searchText, 300);

  return {
    searchText,
    searchTextDebounced,
  };
}
