import { createRouter, createWebHashHistory } from 'vue-router';

import SettingPage from './pages/SettingPage.vue';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'setting',
            component: SettingPage,
        },
    ],
});

export default router;
