<script setup lang="ts">
import type { I18nLocales } from '@/utils/i18n';
import type { DuplicatedUrlOpenedOption, FaviconSource } from '@/utils/types';

import { browser } from '#imports';
import { Checkbox, Form, FormItem, RadioButton, RadioGroup, Select, SelectOption } from 'ant-design-vue';

import useI18n from '@/composables/i18n';
import { useSetting } from '../composables/setting';

const { labelSpan, wrapperSpan } = defineProps<{
    labelSpan: number;
    wrapperSpan: number;
}>();

const { t } = useI18n();

const { setting } = await useSetting();

const labelCol = { span: labelSpan };
const wrapperCol = { span: wrapperSpan };

async function checkFavicioCachingPermission() {
    const permissions = {
        'favicon.im': ['https://favicon.im/*'],
        google: ['https://www.google.com/s2/favicons/*', 'https://*.gstatic.com/faviconV2/*'],
        duckduckgo: ['https://icons.duckduckgo.com/ip3/'],
    };

    const requiredPermissions = permissions[setting.value.faviconSource];
    return await browser.permissions.request({ origins: requiredPermissions });
}

async function updateFaviconCaching(checked: boolean) {
    if (checked && (await checkFavicioCachingPermission())) {
        setting.value.faviconCaching = true;
    }
    else {
        setting.value.faviconCaching = false;
    }
}

updateFaviconCaching(setting.value.faviconCaching);
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

        <FormItem :label="t('option.setting.faviconSource')">
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

        <FormItem :label="t('option.setting.faviconCaching')">
            <Checkbox :checked="setting.faviconCaching" @update:checked="updateFaviconCaching" />
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
