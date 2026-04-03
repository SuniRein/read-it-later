<script setup lang="ts">
import type { PageUpdateInfo } from '@/composables/page-list';
import type { PageItem } from '@/utils/types';
import AutoComplete from '@/components/AutoComplete.vue';
import notify from '@/utils/notify';

const props = defineProps<{
  tags: string[];
}>();

const emit = defineEmits<{
  save: [info: PageUpdateInfo];
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
const descInput = ref('');

watch(item, (newItem) => {
  if (newItem) {
    titleInput.value = newItem.info.title;
    tagsInput.value = newItem.tags.join(', ');
    descInput.value = newItem.desc;
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

const tagValidationRegex = /^[\w\-\p{Script=Han}]+$/u;

function handleSave() {
  const tags = parseTags(tagsInput.value);
  if (tags.some(tag => !tagValidationRegex.test(tag))) {
    notify.error(t('popup.msg.invalidTags'));
    return;
  }
  emit('save', {
    title: titleInput.value,
    tags,
    desc: descInput.value,
  });
}
</script>

<template>
  <Sheet v-model:open="open">
    <SheetContent side="right" class="w-102">
      <ScrollArea class="min-h-0 pr-2">
        <SheetHeader>
          <SheetTitle class="text-lg">
            {{ t('popup.editModal.title') }}
          </SheetTitle>
          <SheetDescription>
            {{ t('popup.editModal.desc') }}
          </SheetDescription>
        </SheetHeader>

        <div class="grid gap-4 px-2">
          <div class="grid gap-2">
            <Label for="title">{{ t('popup.editModal.field.title') }}</Label>
            <Input id="title" v-model="titleInput" />
          </div>

          <div class="grid gap-2">
            <div class="flex items-center justify-between">
              <Label for="tags">{{ t('popup.editModal.field.tags.label') }}</Label>
              <span class="text-xs text-muted-foreground">
                {{ t('popup.editModal.field.tags.desc') }}
              </span>
            </div>
            <AutoComplete
              id="tags"
              v-model="tagsInput"
              :placeholder="t('popup.editModal.field.tags.placeholder')"
              :items="options"
              @select="({ value }) => tagsInput = `${textBeforeLastToken}${value}`"
            />
          </div>

          <div class="grid gap-2">
            <Label for="desc">{{ t('popup.editModal.field.desc.label') }}</Label>
            <Textarea id="desc" v-model="descInput" rows="4" :placeholder="t('popup.editModal.field.desc.placeholder')" />
          </div>
        </div>

        <SheetFooter
          class="
            flex-col gap-2
            sm:flex-col
          "
        >
          <Button class="w-full" @click="handleSave">
            {{ t('common.action.save') }}
          </Button>
          <Button variant="outline" class="w-full" @click="open = false">
            {{ t('common.action.cancel') }}
          </Button>
        </SheetFooter>
      </ScrollArea>
    </SheetContent>
  </Sheet>
</template>
