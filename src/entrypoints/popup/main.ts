import i18n from '@/common/i18n';
import { IsDarkKey, StorageItemsKey } from '@/common/symbols';
import { setupFontSize, setupLocale, setupTheme, useSetting } from '@/composables/setting';
import { createStorageItems } from '@/storage';

import App from './App.vue';
import '@/style.css';
import 'vue-sonner/style.css';

async function bootstrap() {
  const items = createStorageItems();
  const { colorMode, locale, fontSize } = await useSetting(items);

  setupLocale(locale);
  setupFontSize(fontSize);

  const { isDark } = setupTheme(colorMode);

  createApp(App)
    .use(i18n)
    .provide(IsDarkKey, isDark)
    .provide(StorageItemsKey, items)
    .mount('#app');

  browser.runtime.connect({ name: 'popup-communication' });
}

void bootstrap();
