import type { Browser } from '#imports';

import { browser } from '#imports';
import { computed } from 'vue';

export function handleConnection() {
    let popupPort: Browser.runtime.Port | null = null;

    browser.runtime.onConnect.addListener((port) => {
        if (port.name === 'popup-communication') {
            popupPort = port;
            port.onDisconnect.addListener(() => {
                popupPort = null;
            });
        }
    });

    return computed(() => popupPort !== null);
}
