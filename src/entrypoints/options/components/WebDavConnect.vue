<script setup lang="ts">
import type { WebDavConfig } from '@/utils/types';

import { Button, FormItem, Input, InputPassword } from 'ant-design-vue';

import useI18n from '@/composables/i18n';

defineProps<{ buttonWrapperCol: { offset: number } }>();

const config = defineModel<WebDavConfig>({ required: true });

const { t } = useI18n();

function validate() {}

function save() {}

function load() {}

defineExpose({ save, load });
</script>

<template>
    <div class="webdav-config">
        <FormItem :label="t('option.data.cloudStorage.webdav.url')">
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
