import store from '@/utils/store';

export async function setupTheme(element = document.documentElement) {
  const colorMode = ref((await store.setting.getValue()).colorMode);
  const preferDark = usePreferredDark();

  store.setting.watch((newValue) => {
    colorMode.value = newValue.colorMode;
  });

  const isDark = computed(() =>
    colorMode.value === 'auto' ? preferDark.value : colorMode.value === 'dark',
  );

  watch(isDark, (value) => {
    element.classList.toggle('dark', value);
  }, { immediate: true });

  return { isDark };
}
