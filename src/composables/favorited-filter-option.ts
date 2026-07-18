import type { StorageItems } from '@/storage';
import { useStoredValue } from '@/composables/store';

export function useFavoritedFilterOption(items: Pick<StorageItems, 'favoritedFilterOption'>) {
  const favoritedFilterOption = useStoredValue(items.favoritedFilterOption);

  function change() {
    switch (favoritedFilterOption.value) {
      case 'all':
        favoritedFilterOption.value = 'favorited';
        break;
      case 'favorited':
        favoritedFilterOption.value = 'unfavorited';
        break;
      case 'unfavorited':
        favoritedFilterOption.value = 'all';
        break;
    }
  }

  return {
    favoritedFilterOption,
    change,
  };
}
