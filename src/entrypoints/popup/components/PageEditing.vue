<script setup lang="ts">
import { ref } from 'vue';

import { Input, Button } from 'ant-design-vue';

const { initTitle, initTags } = defineProps<{
    initTitle: string;
    initTags: string[];
}>();

const title = ref<string>(initTitle);
const tagsRaw = ref<string>(initTags.join(', '));

const emit = defineEmits<{
    (e: 'cancel'): void;
    (e: 'save', title: string, tags: string[]): void;
}>();

function parseTags(raw: string) {
    return Array.from(
        new Set(
            raw
                .split(',')
                .map((tag) => tag.trim())
                .filter((tag) => tag),
        ),
    );
}

function save() {
    const tags = parseTags(tagsRaw.value);
    emit('save', title.value, tags);
}
</script>

<template>
    <div class="page-list-editing">
        <Input size="small" addonBefore="Title" v-model:value="title" />
        <div class="control">
            <Input size="small" addonBefore="Tags" v-model:value="tagsRaw" placeholder="tag1, tag2, ..." />
            <Button size="small" @click="emit('cancel')">Cancel</Button>
            <Button size="small" @click="save" type="primary">Save</Button>
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
