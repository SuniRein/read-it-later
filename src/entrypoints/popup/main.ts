import { useSettings } from '@/app/settings';
import { setupFontSize, setupLocale, setupTheme } from '@/app/theme';
import { IsDarkKey, StorageItemsKey } from '@/common/symbols';
import { createStorageItems } from '@/storage';

import App from './App.vue';
import '@/style.css';
import 'vue-sonner/style.css';

async function bootstrap() {
  const items = createStorageItems();
  const { colorMode, fontSize, locale, ready } = useSettings(items);
  await ready;

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
