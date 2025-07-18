<script setup lang="ts">
import type { FaviconSource } from '@/utils/types';

import { Button, Checkbox, Form, FormItem, Select, SelectOption, Space } from 'ant-design-vue';
import { useSetting } from '@/composables/setting';

const { labelSpan, wrapperSpan } = defineProps<{
    labelSpan: number;
    wrapperSpan: number;
}>();

const { setting, save, reset } = useSetting();

const labelCol = { span: labelSpan };
const wrapperCol = { span: wrapperSpan };
</script>

<template>
    <Form :model="setting" :label-col :wrapper-col>
        <FormItem label="Pagination">
            <Select v-model:value="setting.pagination">
                <SelectOption :value="10">
                    10 items per page
                </SelectOption>
                <SelectOption :value="20">
                    20 items per page
                </SelectOption>
                <SelectOption :value="50">
                    50 items per page
                </SelectOption>
            </Select>
        </FormItem>

        <FormItem label="Show page count">
            <Checkbox v-model:checked="setting.showPageCount" />
        </FormItem>

        <FormItem label="Favicon source">
            <Select v-model:value="setting.faviconSource">
                <SelectOption :value="'favicon.im' satisfies FaviconSource">
                    Favicon.im
                </SelectOption>
                <SelectOption :value="'google' satisfies FaviconSource">
                    Google
                </SelectOption>
                <SelectOption :value="'duckduckgo' satisfies FaviconSource">
                    DuckDuckGo
                </SelectOption>
            </Select>
        </FormItem>

        <FormItem :wrapper-col="{ span: 14, offset: 6 }">
            <Space>
                <Button shape="round" @click="reset">
                    Reset
                </Button>
                <Button shape="round" type="primary" @click="save">
                    Save
                </Button>
            </Space>
        </FormItem>
    </Form>
</template>
