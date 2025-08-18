<script setup lang="ts">
import type { WebDavConfig } from '@/utils/types';

import { browser } from '#imports';
import { Button, FormItem, Input, InputPassword } from 'ant-design-vue';

import useI18n from '@/composables/i18n';
import notify from '@/utils/notify';
import WebDav from '@/utils/webdav';

defineProps<{ buttonWrapperCol: { offset: number } }>();

const config = defineModel<WebDavConfig>({ required: true });

const { t } = useI18n();

async function checkPermission(url?: string) {
    if (!url) {
        notify.error(t('option.data.cloudStorage.webdav.message.urlRequired'));
        return false;
    }

    if (await browser.permissions.request({ origins: [url] }))
        return true;
    notify.error(t('option.data.cloudStorage.webdav.message.permissionDenied'));
    return false;
}

async function validate() {
    if (!await checkPermission(config.value.url))
        return;

    const client = WebDav.connect(config.value);
    try {
        await client.exists('/');
    }
    catch (e) {
        if (e instanceof Error) {
            notify.error(e.message);
            return;
        }
    }
    notify.success(t('option.data.cloudStorage.webdav.message.validateSuccess'));
}

async function save() {
    if (!await checkPermission(config.value.url))
        return;

    console.error('WebDav save not implemented yet');
}

async function load() {
    if (!await checkPermission(config.value.url))
        return;

    console.error('WebDav load not implemented yet');
}

defineExpose({ save, load });
</script>

<template>
    <div class="webdav-config">
        <FormItem :label="t('option.data.cloudStorage.webdav.url')">
            <!-- TODO: URL validate -->
            <Input v-model:value="config.url" />
        </FormItem>

        <FormItem :label="t('option.data.cloudStorage.webdav.username')">
            <Input v-model:value="config.username" />
        </FormItem>

        <FormItem :label="t('option.data.cloudStorage.webdav.password')">
            <InputPassword v-model:value="config.password" />
        </FormItem>

        <FormItem :wrapper-col="buttonWrapperCol">
            <Button type="primary" @click="validate">
                {{ t('option.data.cloudStorage.webdav.validate') }}
            </Button>
        </FormItem>
    </div>
</template>
