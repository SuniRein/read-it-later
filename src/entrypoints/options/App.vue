<script lang="ts" setup>
import { ConfigProvider, theme as antTheme } from 'ant-design-vue';

import SettingPage from './pages/SettingPage.vue';

const theme = {
    algorithm: antTheme.defaultAlgorithm,
};
</script>

<template>
    <ConfigProvider :theme>
        <SettingPage />
    </ConfigProvider>
</template>
