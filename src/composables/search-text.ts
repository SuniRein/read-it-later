import { refDebounced } from '@vueuse/core';
import { useStoredValue } from '@/composables/store';
import store from '@/utils/store';

export function useSearchText() {
  const searchText = useStoredValue(store.searchText);
  const searchTextDebounced = refDebounced(searchText, 300);

  return {
    searchText,
    searchTextDebounced,
  };
}
