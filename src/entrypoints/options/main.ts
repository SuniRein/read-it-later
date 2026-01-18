import { createApp } from 'vue';

import i18n from '@/utils/i18n';
import store from '@/utils/store';

import App from './App.vue';

import router from './router';
import './style.css';

async function bootstrap() {
  const { locale } = await store.setting.getValue();
  i18n.global.locale.value = locale;

  store.setting.watch(({ locale }) => {
    i18n.global.locale.value = locale;
  });

  createApp(App)
    .use(i18n)
    .use(router)
    .mount('#app');
}

void bootstrap();
