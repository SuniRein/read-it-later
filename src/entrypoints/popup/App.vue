<script lang="ts" setup>
import { IsDarkKey } from '@/utils/symbols';
import Popup from './components/Popup.vue';

const isDark = inject(IsDarkKey);
</script>

<template>
  <Popup />
  <Sonner rich-colors position="top-center" :theme="isDark ? 'dark' : 'light'" />
</template>
