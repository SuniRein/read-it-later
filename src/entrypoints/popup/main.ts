import { browser } from '#imports';
import { createApp } from 'vue';

import i18n from '@/utils/i18n';
import store from '@/utils/store';

import App from './App.vue';
import './style.css';

async function bootstrap() {
    const { locale } = await store.setting.getValue();
    i18n.global.locale.value = locale;

    store.setting.watch(({ locale }) => {
        i18n.global.locale.value = locale;
    });

    createApp(App)
        .use(i18n)
        .mount('#app');

    browser.runtime.connect({ name: 'popup-communication' });
}

bootstrap();
