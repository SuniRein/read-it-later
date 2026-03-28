import { setupFontSize, setupLocale, setupTheme, useSetting } from '@/composables/setting';
import i18n from '@/utils/i18n';
import { IsDarkKey } from '@/utils/symbols';

import App from './App.vue';

import router from './router';
import '@/style.css';
import 'vue-sonner/style.css';

async function bootstrap() {
  const { colorMode, fontSize, locale } = await useSetting();

  setupLocale(locale);
  setupFontSize(fontSize);

  const { isDark } = setupTheme(colorMode);

  createApp(App)
    .use(i18n)
    .use(router)
    .provide(IsDarkKey, isDark)
    .mount('#app');
}

void bootstrap();
