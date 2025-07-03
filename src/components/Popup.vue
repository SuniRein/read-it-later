<script lang="ts" setup>
import { ref } from 'vue';

import { sendMessage } from '@/utils/message';

const title = ref<string>('');
const url = ref<string>('');

async function getInfo() {
    const tab = await sendMessage('getActiveTab');
    const pageInfo = await sendMessage('getPageInfo', { tab });
    title.value = pageInfo.title;
    url.value = pageInfo.url;
}
</script>

<template>
    <div class="top-operation">
        <button @click="getInfo">Get Info</button>
    </div>

    <div class="page-info" v-if="title">
        <p>Title: {{ title }}</p>
        <p>URL: {{ url }}</p>
    </div>
</template>
