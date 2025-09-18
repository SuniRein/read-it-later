import { createRouter, createWebHashHistory } from 'vue-router';

import AboutPage from './pages/AboutPage.vue';
import DataPage from './pages/DataPage.vue';
import SettingPage from './pages/SettingPage.vue';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'setting',
            component: SettingPage,
        },
        {
            path: '/data',
            name: 'data',
            component: DataPage,
        },
        {
            path: '/about',
            name: 'about',
            component: AboutPage,
        },
    ],
});

export default router;
