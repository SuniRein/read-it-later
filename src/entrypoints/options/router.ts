import { createRouter, createWebHashHistory } from 'vue-router';

import DataPage from './pages/DataPage.vue';
import AboutView from './views/AboutView.vue';
import SettingView from './views/SettingView.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'setting',
      component: SettingView,
    },
    {
      path: '/data',
      name: 'data',
      component: DataPage,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
  ],
});

export default router;
