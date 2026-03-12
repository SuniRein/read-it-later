import { setupTheme } from '@/composables/theme';
import i18n from '@/utils/i18n';
import store from '@/utils/store';
import { IsDarkKey } from '@/utils/symbols';

import App from './App.vue';

import router from './router';
import '@/style.css';
import 'vue-sonner/style.css';

async function bootstrap() {
  const { locale } = await store.setting.getValue();
  i18n.global.locale.value = locale;

  store.setting.watch(({ locale }) => {
    i18n.global.locale.value = locale;
  });

  const { isDark } = await setupTheme();

  createApp(App)
    .use(i18n)
    .use(router)
    .provide(IsDarkKey, isDark)
    .mount('#app');
}

void bootstrap();
