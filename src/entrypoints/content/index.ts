import { setupFontSize, setupLocale, setupTheme, useSetting } from '@/composables/setting';
import { createStorageItems } from '@/storage';
import i18n from '@/utils/i18n';
import { IsDarkKey, StorageItemsKey } from '@/utils/symbols';
import App from './App.vue';

import '@/style.css';
import 'vue-sonner/style.css';

export default defineContentScript({
  matches: ['<all_urls>'],
  cssInjectionMode: 'ui',

  async main(ctx) {
    if (ctx.isInvalid) {
      console.warn('Content script is invalid, skipping execution.');
      return;
    }

    const items = createStorageItems();
    const { colorMode, fontSize, locale } = await useSetting(items);

    setupLocale(locale);

    const ui = await createShadowRootUi(ctx, {
      name: 'read-it-later-simply-ui',
      position: 'inline',
      anchor: 'body',
      onMount: async (container) => {
        setupFontSize(fontSize, container);
        const { isDark } = setupTheme(colorMode, container);

        const app = createApp(App);
        app
          .use(i18n)
          .provide(IsDarkKey, isDark)
          .provide(StorageItemsKey, items)
          .mount(container);
        return app;
      },
      onRemove: async (app) => {
        (await app)?.unmount();
      },
    });

    ui.mount();
  },
});
