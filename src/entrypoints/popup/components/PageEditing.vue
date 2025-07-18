<script setup lang="ts">
import { Button, Input, message } from 'ant-design-vue';

import { ref } from 'vue';

const { initTitle, initTags } = defineProps<{
    initTitle: string;
    initTags: string[];
}>();

const emit = defineEmits<{
    (e: 'cancel'): void;
    (e: 'save', title: string, tags: string[]): void;
}>();
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
            content: 'Tags can only contain letters, numbers, underscores, and hyphens.',
            duration: 2,
        });
    }
    emit('save', title.value, tags);
}
</script>

<template>
    <div class="page-list-editing">
        <Input v-model:value="title" size="small" addon-before="Title" />
        <div class="control">
            <Input v-model:value="tagsRaw" size="small" addon-before="Tags" placeholder="tag1, tag2, ..." />
            <Button size="small" @click="emit('cancel')">
                Cancel
            </Button>
            <Button size="small" type="primary" @click="save">
                Save
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
