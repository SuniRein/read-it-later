import i18n from '@/common/i18n';
import { IsDarkKey, StorageItemsKey } from '@/common/symbols';
import { setupFontSize, setupLocale, setupTheme, useSetting } from '@/composables/setting';
import { createStorageItems } from '@/storage';

import App from './App.vue';

import router from './router';
import '@/style.css';
import 'vue-sonner/style.css';

async function bootstrap() {
  const items = createStorageItems();
  const { colorMode, fontSize, locale } = await useSetting(items);

  setupLocale(locale);
  setupFontSize(fontSize);

  const { isDark } = setupTheme(colorMode);

  createApp(App)
    .use(i18n)
    .use(router)
    .provide(IsDarkKey, isDark)
    .provide(StorageItemsKey, items)
    .mount('#app');
}

void bootstrap();
