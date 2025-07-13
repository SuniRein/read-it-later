import { defineConfig } from 'wxt';

export default defineConfig({
    srcDir: 'src',
    imports: false,
    modules: ['@wxt-dev/module-vue'],
    manifest: {
        name: 'Read It Later Simply',
        permissions: ['tabs', 'storage', 'downloads'],
    },
});
