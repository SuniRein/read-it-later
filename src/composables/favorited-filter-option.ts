import { useStoredValue } from '@/composables/store';
import store from '@/utils/store';

export function useFavoritedFilterOption() {
  const favoritedFilterOption = useStoredValue(store.forvoritedFilterOption);

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
