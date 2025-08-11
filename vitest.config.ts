import vueI18n from '@intlify/unplugin-vue-i18n/vite';
import Vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';
import { WxtVitest } from 'wxt/testing';

export default defineConfig({
    test: {
        mockReset: true,
        restoreMocks: true,
        environment: 'happy-dom',
        setupFiles: './tests/setup.ts',
    },
    plugins: [
        Vue(),
        vueI18n({ include: 'assets/locales/*.json' }),
        WxtVitest(),
    ],
});
