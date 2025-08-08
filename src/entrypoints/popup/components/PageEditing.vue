<script setup lang="ts">
import { Button, Input, message } from 'ant-design-vue';
import { ref } from 'vue';

import useI18n from '@/composables/i18n';

const { initTitle, initTags } = defineProps<{
    initTitle: string;
    initTags: string[];
}>();

const emit = defineEmits<{
    (e: 'cancel'): void;
    (e: 'save', title: string, tags: string[]): void;
}>();

const { t } = useI18n();

const title = ref<string>(initTitle);
const tagsRaw = ref<string>(initTags.join(', '));

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
    if (tags.some(tag => !/^[\w-]+$/.test(tag))) {
        return message.error({
            content: t('errorMsg.invalidTags'),
            duration: 2,
        });
    }
    emit('save', title.value, tags);
}

function cancel() {
    emit('cancel');
}
</script>

<template>
    <div
        class="page-list-editing"
        @keydown.enter="save"
        @keydown.ctrl.e="cancel"
    >
        <Input v-model:value="title" size="small" :addon-before="t('edit.title')" />
        <div class="control">
            <Input v-model:value="tagsRaw" size="small" :addon-before="t('edit.tags')" :placeholder="t('edit.tagsPlaceholder')" />
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
