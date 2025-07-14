import { fakeBrowser } from '#imports';
import { defineComponent } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import flushPromises from 'flush-promises';

import { useFavicon } from '../favicon';
import store from '@/utils/store';

describe('useFavicon', () => {
    beforeEach(() => {
        fakeBrowser.reset();
    });

    function getFaviconUrl(url: string) {
        const testComponent = defineComponent({
            props: { url: String },
            setup(props) {
                const { getFaviconUrl } = useFavicon();
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
            await store.setting.setValue({ ...store.setting.fallback, faviconSource: source });
        }

        const faviconUrl = getFaviconUrl(testUrl);
        await flushPromises();
        expect(faviconUrl()).toBe(expectedUrl);
    });
});
