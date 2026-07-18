<script setup lang="ts">
import { handleNotify } from '@/common/message';
import { IsDarkKey } from '@/common/symbols';
import useI18n from '@/composables/i18n';

const isDark = inject(IsDarkKey);

const { t } = useI18n();

handleNotify(t);
</script>

<template>
  <Sonner rich-colors position="top-center" :theme="isDark ? 'dark' : 'light'" />
</template>
