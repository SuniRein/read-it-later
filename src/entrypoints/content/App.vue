<script setup lang="ts">
import useI18n from '@/composables/i18n';
import { handleNotify } from '@/utils/message';

const { t } = useI18n();

handleNotify(t);
</script>

<template>
  <Sonner rich-colors position="top-center" />
</template>
