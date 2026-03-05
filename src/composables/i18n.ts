import type { I18nLocales, I18nSchema } from '@/utils/i18n';

import { useI18n } from 'vue-i18n';

export default useI18n<[I18nSchema], I18nLocales>;

type LeaveKeys<T> = {
  [K in keyof T]: T[K] extends object
    ? `${K & string}.${LeaveKeys<T[K]>}`
    : `${K & string}`;
}[keyof T];

export type I18nKey = LeaveKeys<I18nSchema>;
