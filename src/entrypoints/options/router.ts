import { createRouter, createWebHashHistory } from 'vue-router';

import SettingPage from './pages/SettingPage.vue';
import DataPage from './pages/DataPage.vue';

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
