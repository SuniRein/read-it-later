<script setup lang="ts">
import useI18n from '@/composables/i18n';
import { handleNotify } from '@/utils/message';
import { IsDarkKey } from '@/utils/symbols';

const isDark = inject(IsDarkKey);

const { t } = useI18n();

handleNotify(t);
</script>

<template>
  <Sonner rich-colors position="top-center" :theme="isDark ? 'dark' : 'light'" />
</template>
