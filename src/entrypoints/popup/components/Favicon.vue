<script setup lang="ts">
import { Avatar } from 'ant-design-vue';
import { onMounted, ref } from 'vue';

import { sendMessage } from '@/utils/message';

const { url } = defineProps<{ url?: string }>();
const imgSrc = ref<string | undefined>(undefined);

if (url) {
    onMounted(async () => {
        const dataUrl = await sendMessage('fetchImageFromCache', { url });
        imgSrc.value = dataUrl;
    });
}
</script>

<template>
    <Avatar v-if="imgSrc" class="favicon" :src="imgSrc" size="small" />
    <div v-else class="favicon" />
</template>

<style scoped>
.favicon {
    height: 16px;
    width: 16px;
    min-height: 16px;
    min-width: 16px;
    margin-right: 0.5rem;
    vertical-align: middle;
    position: relative;
}
</style>
