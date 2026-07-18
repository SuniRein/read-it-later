import type { FaviconSource } from '@/utils/types';
import { deepToRaw } from '@/utils/object';
import store from '@/utils/store';

const faviconSourcePermissions: Record<FaviconSource, string[]> = {
  'favicon.im': ['https://favicon.im/*'],
  google: ['https://www.google.com/s2/favicons/*', 'https://*.gstatic.com/faviconV2/*'],
  duckduckgo: ['https://icons.duckduckgo.com/ip3/'],
};

export function getFaviconPermissions(source: FaviconSource): string[] {
  return faviconSourcePermissions[source];
}

export async function requestFaviconCachingPermission(source: FaviconSource): Promise<boolean> {
  return browser.permissions.request({ origins: getFaviconPermissions(source) });
}

export async function checkFaviconCachingPermission(source: FaviconSource): Promise<boolean> {
  return browser.permissions.contains({ origins: getFaviconPermissions(source) });
}

export async function useSetting() {
  const setting = ref(await store.setting.getValue());

  watchDeep(setting, async newValue => store.setting.setValue(deepToRaw(newValue)));

  return { setting };
}
