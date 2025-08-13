<script setup lang="ts">
import type { I18nLocales } from '@/utils/i18n';
import type { FaviconSource } from '@/utils/types';

import { watchDeep } from '@vueuse/core';
import { Checkbox, Form, FormItem, RadioButton, RadioGroup, Select, SelectOption } from 'ant-design-vue';
import { ref } from 'vue';

import useI18n from '@/composables/i18n';
import { deepToRaw } from '@/utils/object';
import store from '@/utils/store';

const { labelSpan, wrapperSpan } = defineProps<{
    labelSpan: number;
    wrapperSpan: number;
}>();

const { t } = useI18n();

const setting = ref(await store.setting.getValue());
watchDeep(setting, newValue => store.setting.setValue(deepToRaw(newValue)));

const labelCol = { span: labelSpan };
const wrapperCol = { span: wrapperSpan };
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
