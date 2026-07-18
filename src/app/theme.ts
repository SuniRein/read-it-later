import type { I18nLocales } from '@/common/i18n';
import type { ColorMode, FontSize } from '@/common/types';
import i18n from '@/common/i18n';

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

export function setupFontSize(fontSize: Ref<FontSize>, element = document.documentElement) {
  watchImmediate(fontSize, (value) => {
    element.style.setProperty('font-size', value === 'normal' ? '16px' : '14px');
  });
}
