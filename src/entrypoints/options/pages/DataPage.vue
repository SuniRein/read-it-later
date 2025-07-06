<script setup lang="ts">
import { browser } from '#imports';

import { Form, FormItem, Button, Space } from 'ant-design-vue';

import { usePageList } from '@/composables/page-list';

const { labelSpan, wrapperSpan } = defineProps<{
    labelSpan: number;
    wrapperSpan: number;
}>();

const labelCol = { span: labelSpan };
const wrapperCol = { span: wrapperSpan };

const { pageList } = usePageList();

function saveToLocalStorage() {
    const data = JSON.stringify(pageList.value);

    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `read-it-later-${timestamp}.json`;

    browser.downloads
        .download({
            url,
            filename,
            saveAs: true,
        })
        .then(() => {
            URL.revokeObjectURL(url);
        });
}
</script>

<template>
    <Form :labelCol :wrapperCol>
        <FormItem label="Local Storage">
            <Space>
                <Button shape="round" @click="saveToLocalStorage">Save</Button>
                <Button shape="round">Load</Button>
            </Space>
        </FormItem>
    </Form>
</template>
