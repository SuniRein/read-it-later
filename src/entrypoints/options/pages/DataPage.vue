<script setup lang="ts">
import type { UploadProps } from 'ant-design-vue';
import type { CloudStorageType } from '@/utils/types';

import { browser } from '#imports';

import { Button, Divider, Form, FormItem, Input, InputPassword, RadioButton, RadioGroup, Space, Upload } from 'ant-design-vue';
import useI18n from '@/composables/i18n';
import { usePageList } from '@/composables/page-list';
import notify from '@/utils/notify';

import { deserializePageList, serializePageList } from '@/utils/page-list-serializatoin';
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

        <div v-if="setting.cloudStorage === 'webdav'" class="webdav-config">
            <FormItem :label="t('option.data.cloudStorage.webdav.url')">
                <Input v-model:value="setting.webDavConfig.url" />
            </FormItem>

            <FormItem :label="t('option.data.cloudStorage.webdav.username')">
                <Input v-model:value="setting.webDavConfig.username" />
            </FormItem>

            <FormItem :label="t('option.data.cloudStorage.webdav.password')">
                <InputPassword v-model:value="setting.webDavConfig.password" />
            </FormItem>

            <FormItem :wrapper-col="buttonWrapperCol">
                <Button type="primary">
                    {{ t('option.data.cloudStorage.webdav.validate') }}
                </Button>
            </FormItem>
        </div>

        <FormItem :wrapper-col="buttonWrapperCol">
            <Space>
                <Button shape="round" :disabled="setting.cloudStorage === null">
                    {{ t('option.data.save') }}
                </Button>

                <Upload accept=".json">
                    <Button shape="round" :disabled="setting.cloudStorage === null">
                        {{ t('option.data.load') }}
                    </Button>
                </Upload>
            </Space>
        </FormItem>
    </Form>
</template>

<style scoped>
.webdav-config {
    margin: 16px auto;
    padding: 16px;
    width: fit-content;
    min-width: 60%;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
}
</style>
