<script setup lang="ts">
import { Form, FormItem, Button, Space } from 'ant-design-vue';

const { labelSpan, wrapperSpan } = defineProps<{
    labelSpan: number;
    wrapperSpan: number;
}>();

const labelCol = { span: labelSpan };
const wrapperCol = { span: wrapperSpan };
</script>

<template>
    <Form :labelCol :wrapperCol>
        <FormItem label="Local Storage">
            <Space>
                <Button shape="round">Save</Button>
                <Button shape="round">Load</Button>
            </Space>
        </FormItem>
    </Form>
</template>
