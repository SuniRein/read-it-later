import type { I18nKey, I18nLocales, I18nSchema } from '@/utils/i18n';

import { useI18n } from 'vue-i18n';

type UseI18n = ReturnType<typeof useI18n<[I18nSchema], I18nLocales>>;
type UseI18nT = (key: I18nKey, args?: Record<string, unknown>) => string;

export default useI18n as unknown as () => Omit<UseI18n, 't'> & { t: UseI18nT };
