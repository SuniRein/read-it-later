<script setup lang="ts">
import type { UploadProps } from 'ant-design-vue';
import type { CloudStorageType } from '@/utils/types';

import { browser } from '#imports';
import { Button, Divider, Form, FormItem, RadioButton, RadioGroup, Space, Upload } from 'ant-design-vue';
import { useTemplateRef } from 'vue';

import useI18n from '@/composables/i18n';
import { usePageList } from '@/composables/page-list';
import notify from '@/utils/notify';
import { deserializePageList, serializePageList } from '@/utils/page-list-serializatoin';

import WebDavConnect from '../components/WebDavConnect.vue';
import { useSetting } from '../composables/setting';

const { labelSpan, wrapperSpan } = defineProps<{
    labelSpan: number;
    wrapperSpan: number;
}>();

const labelCol = { span: labelSpan };
const wrapperCol = { span: wrapperSpan };

const buttonWrapperCol = { offset: labelSpan };

const { t } = useI18n();

const { setting } = await useSetting();

const { pageList, load } = usePageList();

function getData() {
    const data = serializePageList(pageList.value);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `read-it-later-${timestamp}.json`;
    return { data, filename };
}

function saveToLocalStorage() {
    const { data, filename } = getData();

    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

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
    }
    else {
        notify.error(t('errorMsg.noUploadFile'));
    }
};

function loadFromFile(file: File) {
    const reader = new FileReader();
    reader.onload = (event) => {
        if (event.target?.result) {
            try {
                const data = deserializePageList(event.target.result as string);
                const numLoad = load(data);
                notify.success(
                    t('successMsg.loadData', { count: numLoad }),
                );
            }
            catch (error) {
                notify.error(t('errorMsg.parseError', { error }));
            }
        }
    };
    reader.readAsText(file);
}

const cloudStorage = useTemplateRef('cloudStorage');

async function saveToCloudStorage() {
    await cloudStorage.value?.save(getData());
}
</script>

<template>
    <Form :label-col :wrapper-col>
        <FormItem :label="t('option.data.localStorage')">
            <Space>
                <Button shape="round" @click="saveToLocalStorage">
                    {{ t('option.data.save') }}
                </Button>
                <Upload accept=".json" :file-list="[]" :custom-request="uploadHandler">
                    <Button shape="round">
                        {{ t('option.data.load') }}
                    </Button>
                </Upload>
            </Space>
        </FormItem>

        <Divider />

        <FormItem :label="t('option.data.cloudStorage.label')">
            <RadioGroup v-model:value="setting.cloudStorage">
                <RadioButton :value="null satisfies CloudStorageType">
                    {{ t('option.data.cloudStorage.type.none') }}
                </RadioButton>
                <RadioButton :value="'webdav' satisfies CloudStorageType">
                    {{ t('option.data.cloudStorage.type.webdav') }}
                </RadioButton>
            </RadioGroup>
        </FormItem>

        <WebDavConnect v-if="setting.cloudStorage === 'webdav'" ref="cloudStorage" v-model="setting.webDavConfig" :button-wrapper-col />

        <FormItem :wrapper-col="buttonWrapperCol">
            <Space>
                <Button shape="round" :disabled="cloudStorage === null" @click="saveToCloudStorage">
                    {{ t('option.data.save') }}
                </Button>

                <Button shape="round" :disabled="setting.cloudStorage === null" @click="cloudStorage?.load()">
                    {{ t('option.data.load') }}
                </Button>
            </Space>
        </FormItem>
    </Form>
</template>
