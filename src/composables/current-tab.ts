import type { Tab } from '@/utils/types';

import { onMessage, sendMessage } from '@/utils/message';

export function useCurrentTab() {
  const currentTab = ref<Tab | null>(null);

  onMounted(async () => {
    currentTab.value = await sendMessage('getCurrentTab');
  });
  onMessage('currentTabChanged', ({ data: { tab } }) => {
    currentTab.value = tab;
  });

  return { currentTab };
}
