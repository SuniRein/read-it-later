import type { I18nLocales, I18nSchema } from '@/utils/i18n';

import enUS from 'ant-design-vue/locale/en_US';
import zhCN from 'ant-design-vue/locale/zh_CN';

import { useI18n } from 'vue-i18n';

export default useI18n<[I18nSchema], I18nLocales>;

export function useAntLocale(locale: MaybeRef<I18nLocales>) {
  return computed(() => {
    switch (unref(locale)) {
      case 'zh_CN': return zhCN;
      case 'en': return enUS;
    }
  });
}
