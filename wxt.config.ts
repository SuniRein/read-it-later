import { defineConfig } from 'wxt';

export default defineConfig({
    srcDir: 'src',
    imports: false,
    modules: ['@wxt-dev/module-vue'],
    manifest: {
        permissions: ['tabs', 'storage', 'downloads'],
    },
});
