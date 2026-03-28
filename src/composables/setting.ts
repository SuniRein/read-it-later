import type { I18nLocales } from '@/utils/i18n';
import type { ColorMode } from '@/utils/types';
import i18n from '@/utils/i18n';
import store from '@/utils/store';

export async function useSetting() {
  const setting = shallowRef(await store.setting.getValue());
  store.setting.watch((newValue) => {
    setting.value = newValue;
  });

  return {
    colorMode: computed(() => setting.value.colorMode),
    locale: computed(() => setting.value.locale),
  };
}

export function setupTheme(colorMode: Ref<ColorMode>, element = document.documentElement) {
  const preferDark = usePreferredDark();

  const isDark = computed(() =>
    colorMode.value === 'auto' ? preferDark.value : colorMode.value === 'dark',
  );

  watchImmediate(isDark, (value) => {
    element.classList.toggle('dark', value);
  });

  return { isDark };
}

export function setupLocale(locale: Ref<I18nLocales>) {
  watchImmediate(locale, (value) => {
    i18n.global.locale.value = value;
  });
}
