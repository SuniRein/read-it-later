<script setup lang="ts">
import type { I18nLocales } from '@/utils/i18n';
import type { DuplicatedUrlOpenedOption, FaviconSource } from '@/utils/types';

import { browser } from '#imports';
import { Button, Checkbox, Form, FormItem, RadioButton, RadioGroup, Select, SelectOption, Space } from 'ant-design-vue';

import useI18n from '@/composables/i18n';
import { sendMessage } from '@/utils/message';
import notify from '@/utils/notify';
import { useSetting } from '../composables/setting';

const { labelSpan, wrapperSpan } = defineProps<{
    labelSpan: number;
    wrapperSpan: number;
}>();

const { t } = useI18n();

const { setting } = await useSetting();

const labelCol = { span: labelSpan };
const wrapperCol = { span: wrapperSpan };

function getRequestedFaviconCachingPermission() {
    const permissions = {
        'favicon.im': ['https://favicon.im/*'],
        google: ['https://www.google.com/s2/favicons/*', 'https://*.gstatic.com/faviconV2/*'],
        duckduckgo: ['https://icons.duckduckgo.com/ip3/'],
    };
    return permissions[setting.value.faviconSource];
}

async function updateFaviconCaching(checked: boolean) {
    if (checked) {
        const requiredPermissions = getRequestedFaviconCachingPermission();
        if (await browser.permissions.request({ origins: requiredPermissions })) {
            setting.value.faviconCaching = true;
            return;
        }
    }
    setting.value.faviconCaching = false;
}

async function checkFaviconCachingPermission() {
    if (setting.value.faviconCaching) {
        const requiredPermissions = getRequestedFaviconCachingPermission();
        if (!await browser.permissions.contains({ origins: requiredPermissions })) {
            notify.error(t('option.setting.favicon.cachePermissionMissing'));
            setting.value.faviconCaching = false;
        }
    }
}

async function clearFaviconCache() {
    await sendMessage('clearImageCache');
    notify.success(t('option.setting.favicon.clearCacheSuccess'));
}

void checkFaviconCachingPermission();
</script>

<template>
    <Form :model="setting" :label-col :wrapper-col>
        <FormItem :label="t('option.setting.panination')">
            <Select v-model:value="setting.pagination">
                <SelectOption :value="10">
                    {{ t('option.setting.paninationOption', { count: 10 }) }}
                </SelectOption>
                <SelectOption :value="20">
                    {{ t('option.setting.paninationOption', { count: 20 }) }}
                </SelectOption>
                <SelectOption :value="50">
                    {{ t('option.setting.paninationOption', { count: 50 }) }}
                </SelectOption>
            </Select>
        </FormItem>

        <FormItem :label="t('option.setting.showBadge')">
            <Checkbox v-model:checked="setting.showBadge" />
        </FormItem>

        <FormItem :label="t('option.setting.favicon.source')">
            <Select v-model:value="setting.faviconSource" @change="() => updateFaviconCaching(setting.faviconCaching)">
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

        <FormItem :label="t('option.setting.favicon.caching')">
            <Space>
                <Checkbox :checked="setting.faviconCaching" @update:checked="updateFaviconCaching" />

                <Button :disabled="!setting.faviconCaching" @click="clearFaviconCache">
                    {{ t('option.setting.favicon.clearCache') }}
                </Button>
            </Space>
        </FormItem>

        <FormItem :label="t('option.setting.duplicatedUrlOpened.label')">
            <Select v-model:value="setting.duplicatedUrlOpened">
                <SelectOption :value="'ignore' satisfies DuplicatedUrlOpenedOption">
                    {{ t('option.setting.duplicatedUrlOpened.ignore') }}
                </SelectOption>
                <SelectOption :value="'focus' satisfies DuplicatedUrlOpenedOption">
                    {{ t('option.setting.duplicatedUrlOpened.focus') }}
                </SelectOption>
                <SelectOption :value="'newTab' satisfies DuplicatedUrlOpenedOption">
                    {{ t('option.setting.duplicatedUrlOpened.newTab') }}
                </SelectOption>
            </Select>
        </FormItem>

        <FormItem :label="t('option.setting.locale')">
            <RadioGroup v-model:value="setting.locale">
                <RadioButton :value="'en' satisfies I18nLocales">
                    English
                </RadioButton>
                <RadioButton :value="'zh_CN' satisfies I18nLocales">
                    简体中文
                </RadioButton>
            </Radiogroup>
        </FormItem>
    </Form>
</template>
