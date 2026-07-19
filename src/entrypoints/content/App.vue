<script setup lang="ts">
import { handleNotify } from '@/common/message';
import { IsDarkKey } from '@/common/symbols';

const isDark = inject(IsDarkKey);

const { t } = useI18n();

handleNotify(t);
</script>

<template>
  <Sonner rich-colors position="top-center" :theme="isDark ? 'dark' : 'light'" />
</template>
