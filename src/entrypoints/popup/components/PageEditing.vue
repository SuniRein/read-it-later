<script setup lang="ts">
import { AutoComplete, Button, Input } from 'ant-design-vue';
import { computed, onMounted, ref, useTemplateRef } from 'vue';

import useI18n from '@/composables/i18n';
import notify from '@/utils/notify';

const { initTitle, initTags, pageTags } = defineProps<{
  initTitle: string;
  initTags: string[];
  pageTags?: string[];
}>();

const emit = defineEmits<{
  (e: 'cancel'): void;
  (e: 'save', title: string, tags: string[]): void;
}>();

const { t } = useI18n();

const title = ref<string>(initTitle);
const tagsRaw = ref<string>(initTags.join(', '));

const lastToken = computed(() => {
  return tagsRaw.value.slice(tagsRaw.value.lastIndexOf(',') + 1).trimStart();
});

const textBeforeLastToken = computed(() => {
  return tagsRaw.value.slice(0, tagsRaw.value.length - lastToken.value.length);
});

const options = computed(() => {
  return pageTags?.filter(t => t.startsWith(lastToken.value)).map(t => ({
    value: `${textBeforeLastToken.value}${t}`,
    label: t,
  }));
});

function parseTags(raw: string) {
  return Array.from(
    new Set(
      raw
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag),
    ),
  );
}

function save() {
  const tags = parseTags(tagsRaw.value);
  if (tags.some(tag => !/^[\w\-\p{Script=Han}]+$/u.test(tag))) {
    notify.error(t('errorMsg.invalidTags'));
    return;
  }
  emit('save', title.value, tags);
}

function cancel() {
  emit('cancel');
}

const input = useTemplateRef('tags-input');

onMounted(() => {
  input.value!.$el.querySelector('input')?.focus();
});
</script>

<template>
  <div
    class="page-list-editing"
    @keydown.ctrl.enter.capture="save"
    @keydown.ctrl.e="cancel"
  >
    <Input v-model:value="title" size="small" :addon-before="t('edit.title')" />
    <div class="control">
      <AutoComplete v-model:value="tagsRaw" :options style="width: 100%">
        <Input ref="tags-input" size="small" :addon-before="t('edit.tags')" :placeholder="t('edit.tagsPlaceholder')" />
      </AutoComplete>
      <Button size="small" @click="cancel">
        {{ t('edit.cancel') }}
      </Button>
      <Button size="small" type="primary" @click="save">
        {{ t('edit.save') }}
      </Button>
    </div>
  </div>
</template>

<style>
.page-list-editing {
  width: 100%;
  padding: 0.2rem;
}

.control {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
</style>
