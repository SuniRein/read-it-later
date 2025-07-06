<script lang="ts" setup>
import { ConfigProvider, theme as antTheme } from 'ant-design-vue';

const theme = {
    algorithm: antTheme.defaultAlgorithm,
};
</script>

<template>
    <ConfigProvider :theme>
        <h1>Welcome to Setting Page</h1>
    </ConfigProvider>
</template>
