<script setup lang="ts">
import type { PageItem } from '@/utils/types';
import AutoComplete from '@/components/AutoComplete.vue';
import notify from '@/utils/notify';

const props = defineProps<{
  tags: string[];
}>();

const emit = defineEmits<{
  save: [title: string, tags: string[]];
}>();

const item = defineModel<PageItem | null>('item', { required: true });

const open = computed({
  get: () => item.value !== null,
  set: (val: boolean) => {
    if (!val)
      item.value = null;
  },
});

const { t } = useI18n();

const titleInput = ref('');
const tagsInput = ref('');

watch(item, (newItem) => {
  if (newItem) {
    titleInput.value = newItem.info.title;
    tagsInput.value = newItem.tags.join(', ');
  }
}, { immediate: true });

const lastToken = computed(() => tagsInput.value.slice(tagsInput.value.lastIndexOf(',') + 1).trimStart());
const textBeforeLastToken = computed(() => tagsInput.value.slice(0, tagsInput.value.length - lastToken.value.length));
const options = computed(() => props.tags?.filter(t => t.startsWith(lastToken.value)).map(t => ({ value: t })));

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

function handleSave() {
  const tags = parseTags(tagsInput.value);
  if (tags.some(tag => !/^[\w\-\p{Script=Han}]+$/u.test(tag))) {
    notify.error(t('errorMsg.invalidTags'));
    return;
  }
  emit('save', titleInput.value, tags);
}
</script>

<template>
  <Sheet v-model:open="open">
    <SheetContent side="right" class="w-100">
      <SheetHeader>
        <SheetTitle class="text-lg">
          {{ t('edit.title') }}
        </SheetTitle>
        <SheetDescription>
          {{ t('edit.description') }}
        </SheetDescription>
      </SheetHeader>

      <div class="grid gap-6 px-2">
        <div class="grid gap-2">
          <Label for="title">{{ t('edit.item.title') }}</Label>
          <Input id="title" v-model="titleInput" />
        </div>

        <div class="grid gap-2">
          <div class="flex items-center justify-between">
            <Label for="tags">{{ t('edit.item.tags.label') }}</Label>
            <span class="text-xs text-muted-foreground">
              {{ t('edit.item.tags.description') }}
            </span>
          </div>
          <AutoComplete
            id="tags"
            v-model="tagsInput"
            :placeholder="t('edit.item.tags.placeholder')"
            :items="options"
            @select="({ value }) => tagsInput = `${textBeforeLastToken}${value}`"
          />
        </div>
      </div>

      <SheetFooter
        class="
          flex-col gap-2
          sm:flex-col
        "
      >
        <Button class="w-full" @click="handleSave">
          {{ t('common.save') }}
        </Button>
        <Button variant="outline" class="w-full" @click="open = false">
          {{ t('common.cancel') }}
        </Button>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>
