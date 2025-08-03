<script setup lang="ts">
import { Input } from 'ant-design-vue';

const searchText = defineModel<string>('value');
</script>

<template>
    <Input v-model:value.trim="searchText" allow-clear placeholder="Find..." />
</template>
