import vueI18n from '@intlify/unplugin-vue-i18n/vite';
import { defineConfig } from 'wxt';

export default defineConfig({
    srcDir: 'src',
    imports: false,
    modules: ['@wxt-dev/module-vue'],
    vite: () => ({
        plugins: [
            vueI18n({
                include: 'assets/locales/*.json',
            }),
        ],
    }),
    manifest: {
        name: 'Read It Later Simply',
        permissions: ['tabs', 'storage', 'downloads'],
    },
});
