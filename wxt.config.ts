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
        name: '__MSG_extName__',
        description: '__MSG_extDescription__',
        default_locale: 'en',
        permissions: ['tabs', 'storage', 'downloads'],
    },
});
