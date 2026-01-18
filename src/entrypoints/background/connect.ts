export function handleConnection() {
  const isConnected = ref(false);

  browser.runtime.onConnect.addListener((port) => {
    if (port.name === 'popup-communication') {
      isConnected.value = true;
      port.onDisconnect.addListener(() => {
        isConnected.value = false;
      });
    }
  });

  return isConnected;
}
