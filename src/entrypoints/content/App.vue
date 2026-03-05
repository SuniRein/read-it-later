<script setup lang="ts">
import useI18n from '@/composables/i18n';
import { onMessage } from '@/utils/message';
import notify from '@/utils/notify';

const { t } = useI18n();

onMessage('addTabResult', ({ data: { success } }) => {
  if (success)
    notify.success(t('common.msg.addTab.success'));
  else
    notify.error(t('common.msg.addTab.pageAlreadyExists'));
});
</script>

<template>
  <Sonner rich-colors position="top-center" />
</template>
