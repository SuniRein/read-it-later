import type schema from '~~/assets/locales/en.json';
import messages from '@intlify/unplugin-vue-i18n/messages';
import { createI18n, useI18n as useVueI18n } from 'vue-i18n';

export type I18nSchema = typeof schema;
export type I18nLocales = 'en' | 'zh_CN';

type LeaveKeys<T> = {
  [K in keyof T]: T[K] extends object
    ? `${K & string}.${LeaveKeys<T[K]>}`
    : `${K & string}`;
}[keyof T];

export type I18nKey = LeaveKeys<I18nSchema>;

export default createI18n<[I18nSchema], I18nLocales, false>({
  legacy: false,
  messages: messages as any,
});

type UseI18n = ReturnType<typeof useVueI18n<[I18nSchema], I18nLocales>>;
type UseI18nT = (key: I18nKey, args?: Record<string, unknown>) => string;

export const useI18n = useVueI18n as unknown as () => Omit<UseI18n, 't'> & { t: UseI18nT };
