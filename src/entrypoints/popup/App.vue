<script lang="ts" setup>
import { theme as antTheme, ConfigProvider } from 'ant-design-vue';

import Popup from './components/Popup.vue';

const theme = {
    algorithm: antTheme.defaultAlgorithm,
};
</script>

<template>
    <ConfigProvider :theme>
        <Popup />
    </ConfigProvider>
</template>
