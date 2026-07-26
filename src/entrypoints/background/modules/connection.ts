import type { BackgroundContext } from '../context';
import { POPUP_PORT_NAME } from '../constants';

export function installConnection(ctx: BackgroundContext): void {
  const connectionCounter = ref(0);
  ctx.isConnected = computed(() => connectionCounter.value > 0);

  browser.runtime.onConnect.addListener((port) => {
    if (port.name === POPUP_PORT_NAME) {
      connectionCounter.value += 1;
      port.onDisconnect.addListener(() => {
        if (connectionCounter.value > 0)
          connectionCounter.value -= 1;
      });
    }
  });
}
