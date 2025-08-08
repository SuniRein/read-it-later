import { createApp } from 'vue';

import i18n from '@/utils/i18n';

import App from './App.vue';

import router from './router';
import './style.css';

createApp(App)
    .use(i18n)
    .use(router)
    .mount('#app');
