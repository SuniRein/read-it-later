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
    manifest: ({ manifestVersion }) => ({
        name: '__MSG_extName__',
        description: '__MSG_extDescription__',
        default_locale: 'en',
        permissions: ['tabs', 'storage', 'downloads'],
        optional_permissions: manifestVersion === 2 ? ['<all_urls>'] : undefined,
        optional_host_permissions: manifestVersion === 3 ? ['<all_urls>'] : undefined,
        commands: {
            'open-popup': {
                suggested_key: {
                    default: 'Alt+R',
                },
                description: '__MSG_commandOpenPopup__',
            },
            'open-random-page': {
                suggested_key: {
                    default: 'Alt+Shift+R',
                },
                description: '__MSG_commandOpenRandomPage__',
            },
            'remove-current-page': {
                description: '__MSG_commandRemoveCurrentPage__',
            },
        },
    }),
});
