export const POPUP_PORT_NAME = 'popup-communication';
export const IMAGE_CACHE_NAME = 'image-cache';
export const CONTEXT_MENU_ID = 'read-it-later-simply';

export function browserAction() {
  return browser.action ?? browser.browserAction;
}
