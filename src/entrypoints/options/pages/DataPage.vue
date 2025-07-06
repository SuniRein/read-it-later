<script setup lang="ts">
import { browser } from '#imports';

import { Form, FormItem, Button, Space, Upload, type UploadProps } from 'ant-design-vue';

import { serializePageList, deserializePageList } from '@/utils/page-list-serializatoin';
import { usePageList } from '@/composables/page-list';

const { labelSpan, wrapperSpan } = defineProps<{
    labelSpan: number;
    wrapperSpan: number;
}>();

const labelCol = { span: labelSpan };
const wrapperCol = { span: wrapperSpan };

const { pageList, load } = usePageList();

function saveToLocalStorage() {
    const data = serializePageList(pageList.value);

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

const uploadHandler: UploadProps['customRequest'] = (options) => {
    if (options.file instanceof File) {
        loadFromFile(options.file);
    } else {
        console.error('No file provided for upload');
    }
};

function loadFromFile(file: File) {
    const reader = new FileReader();
    reader.onload = (event) => {
        if (event.target?.result) {
            try {
                const data = deserializePageList(event.target.result as string);
                load(data);
            } catch (error) {
                console.error('Failed to parse page list:', error);
            }
        }
    };
    reader.readAsText(file);
}
</script>

<template>
    <Form :labelCol :wrapperCol>
        <FormItem label="Local Storage">
            <Space>
                <Button shape="round" @click="saveToLocalStorage">Save</Button>
                <Upload accept=".json" :fileList="[]" :customRequest="uploadHandler">
                    <Button shape="round">Load</Button>
                </Upload>
            </Space>
        </FormItem>
    </Form>
</template>
