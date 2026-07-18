export function handleConnection() {
  const connectionCounter = ref(0);
  const isConnected = computed(() => connectionCounter.value > 0);

  browser.runtime.onConnect.addListener((port) => {
    if (port.name === 'popup-communication') {
      connectionCounter.value += 1;
      port.onDisconnect.addListener(() => {
        if (connectionCounter.value > 0)
          connectionCounter.value -= 1;
      });
    }
  });

  return isConnected;
}
