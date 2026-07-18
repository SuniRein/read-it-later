import type { Tab } from '@/common/types';

import { onMessage, sendMessage } from '@/common/message';

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
