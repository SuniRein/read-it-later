<script lang="ts" setup>
import { theme as antTheme, ConfigProvider } from 'ant-design-vue';
import { useAntLocale } from '@/composables/i18n';

import Popup from './components/Popup.vue';

const theme = {
  algorithm: antTheme.defaultAlgorithm,
};

const { locale } = useI18n();
const antLocale = useAntLocale(locale);
</script>

<template>
  <ConfigProvider :theme :locale="antLocale">
    <Popup />
  </ConfigProvider>

  <Sonner rich-colors position="top-center" />
</template>
