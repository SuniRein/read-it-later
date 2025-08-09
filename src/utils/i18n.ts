import type schema from '~~/assets/locales/en.json';

import messages from '@intlify/unplugin-vue-i18n/messages';
import { createI18n } from 'vue-i18n';

export type I18nSchema = typeof schema;
export type I18nLocales = 'en' | 'zh_CN';

export default createI18n<[I18nSchema], I18nLocales, false>({
    legacy: false,
    messages: messages as any,
});
