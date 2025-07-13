import { browser } from '#imports';

import { createApp } from 'vue';
import './style.css';
import App from './App.vue';

createApp(App).mount('#app');

browser.runtime.connect({ name: 'popup-communication' });
