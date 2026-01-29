import process from 'node:process';
import vueI18n from '@intlify/unplugin-vue-i18n/vite';
import tailwindcss from '@tailwindcss/vite';
import Components from 'unplugin-vue-components/vite';
import devtools from 'vite-plugin-vue-devtools';
import svgLoader from 'vite-svg-loader';
import { defineConfig } from 'wxt';

export default defineConfig({
  srcDir: 'src',
  imports: {
    presets: [
      '@vueuse/core',
      { from: '@/composables/i18n', imports: [['default', 'useI18n']] },
      { from: '@/lib/utils', imports: ['cn'] },
    ],
    warn: (msg: string) => {
      if (!msg.includes('toRef')) {
        console.warn(msg);
      }
    },
    dirsScanOptions: {
      // Disable auto-imports for project's files
      fileFilter: (_file: string) => false,
    },
  },
  modules: ['@wxt-dev/module-vue'],
  vite: () => {
    const useDevtools = process.env.USE_VUE_DEVTOOLS === 'true';
    return {
      plugins: [
        tailwindcss(),
        vueI18n({
          include: 'assets/locales/*.json',
        }),
        svgLoader(),
        Components({
          dirs: ['src/components'],
          dts: 'src/components.d.ts',
        }),
        useDevtools && devtools({
          appendTo: /src\/entrypoints\/[\w-]*\/main\.ts/,
        }),
      ],
    };
  },
  manifest: ({ manifestVersion }) => ({
    name: '__MSG_extName__',
    description: '__MSG_extDescription__',
    default_locale: 'en',
    permissions: ['tabs', 'storage', 'downloads', 'identity'],
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
      'toggle-favorite-current-page': {
        description: '__MSG_commandToggleFavoriteCurrentPage__',
      },
    },
  }),
});
