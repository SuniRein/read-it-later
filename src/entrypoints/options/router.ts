import { createRouter, createWebHashHistory } from 'vue-router';

import AboutView from './views/AboutView.vue';
import ArchiveView from './views/ArchiveView.vue';
import DataView from './views/DataView.vue';
import GuideView from './views/GuideView.vue';
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
      component: DataView,
    },
    {
      path: '/archive',
      name: 'archive',
      component: ArchiveView,
    },
    {
      path: '/guide',
      name: 'guide',
      component: GuideView,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
  ],
});

export default router;
