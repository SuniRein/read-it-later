import { useStoredValue } from '@/composables/store';
import store from '@/utils/store';

export function useSearchText() {
    const searchText = useStoredValue(store.searchText);

    return {
        searchText,
    };
}
