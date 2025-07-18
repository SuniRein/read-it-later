import { createRouter, createWebHashHistory } from 'vue-router';

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
    ],
});

export default router;
