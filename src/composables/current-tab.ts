import type { Tab } from '@/utils/types';

import { onMessage } from '@/utils/message';

export function useCurrentTab() {
  const currentTab = ref<Tab | null>(null);

  onMounted(async () => {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    currentTab.value = tabs[0] ?? null;
  });
  onMessage('currentTabChanged', ({ data: { tab } }) => {
    currentTab.value = tab;
  });

  return { currentTab };
}
