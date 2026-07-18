import { sendMessage } from '@/common/message';

/**
 * Message and browser API facade.
 */

export async function openPage(url: string) {
  return sendMessage('openPage', { url });
}

export async function addCurrentTab() {
  return sendMessage('addCurrentTab');
}

export async function openRandomPage() {
  return sendMessage('openRandomPage');
}

export async function clearImageCache() {
  return sendMessage('clearImageCache');
}

export async function fetchImageFromCache(url: string) {
  return sendMessage('fetchImageFromCache', { url });
}

export async function openPopoutWindow() {
  const url = browser.runtime.getURL('/popup.html?mode=popout');
  return browser.windows.create({ url, type: 'popup' });
}

export async function openOptionsPage() {
  return browser.runtime.openOptionsPage();
}

export function isPopoutMode() {
  return new URLSearchParams(window.location.search).get('mode') === 'popout';
}

export async function copyToClipboard(text: string) {
  return navigator.clipboard.writeText(text);
}
