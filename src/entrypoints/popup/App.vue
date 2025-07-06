<script lang="ts" setup>
import { ConfigProvider, theme as antTheme } from 'ant-design-vue';

import Popup from '@/components/popup/Popup.vue';

const theme = {
    algorithm: antTheme.defaultAlgorithm,
};
</script>

<template>
    <ConfigProvider :theme>
        <Popup />
    </ConfigProvider>
</template>
