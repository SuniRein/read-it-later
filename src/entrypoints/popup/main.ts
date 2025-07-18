import { browser } from '#imports';

import { createApp } from 'vue';
import App from './App.vue';
import './style.css';

createApp(App).mount('#app');

browser.runtime.connect({ name: 'popup-communication' });
