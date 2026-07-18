import { mount } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import { beforeEach, describe, expect, it } from 'vitest';

import { resetSettingsInstance } from '@/app/settings';
import { createStorageItems } from '@/storage';
import { useFaviconUrl } from '../favicon-url';

const items = createStorageItems();

describe('useFavicon', () => {
  beforeEach(() => {
    fakeBrowser.reset();
    resetSettingsInstance();
  });

  function getFaviconUrl(url: string) {
    const testComponent = defineComponent({
      props: { url: String },
      setup(props) {
        const { getFaviconUrl } = useFaviconUrl(items);
        return {
          api: {
            faviconUrl: () => getFaviconUrl(props.url!),
          },
        };
      },
      render() {
        return null;
      },
    });
    const wrapper = mount(testComponent, { props: { url } });
    return wrapper.vm.api.faviconUrl;
  }

  const domain = 's1.www.example.com';
  const testUrl = `https://${domain}/a/b/c.css?d=e`;

  const cases = [
    ['Default', undefined, `https://favicon.im/${domain}?larger=true`],
    ['Google', 'google', `https://www.google.com/s2/favicons?domain=${domain}&sz=128`],
    ['DuckDuckGo', 'duckduckgo', `https://icons.duckduckgo.com/ip3/${domain}.ico`],
  ] as const;

  it.each(cases)('get favicon url for %s', async (_, source, expectedUrl) => {
    if (source) {
      await items.setting.setValue({ ...items.setting.fallback, faviconSource: source });
    }

    const faviconUrl = getFaviconUrl(testUrl);
    await flushPromises();
    expect(faviconUrl()).toBe(expectedUrl);
  });

  it('reflects setting change without remount', async () => {
    await items.setting.setValue({ ...items.setting.fallback, faviconSource: 'google' });

    const faviconUrl = getFaviconUrl(testUrl);
    await flushPromises();
    expect(faviconUrl()).toContain('google.com');

    // Switch source without mounting a new component
    await items.setting.setValue({ ...items.setting.fallback, faviconSource: 'duckduckgo' });
    await flushPromises();
    expect(faviconUrl()).toContain('duckduckgo.com');
  });
});
