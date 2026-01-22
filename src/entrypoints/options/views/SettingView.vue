<script setup lang="ts">
import type { I18nLocales } from '@/utils/i18n';
import type { DuplicatedUrlOpenedOption, FaviconSource } from '@/utils/types';

import { Globe, Layers, ShieldCheck, Trash2 } from 'lucide-vue-next';
import { sendMessage } from '@/utils/message';
import notify from '@/utils/notify';

import SettingOption from '../components/SettingOption.vue';
import SettingSection from '../components/SettingSection.vue';
import { useSetting } from '../composables/setting';

const { t } = useI18n();

const { setting } = await useSetting();

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
      notify.error(t('option.setting.faviconCache.clear.permissionMissing'));
      setting.value.faviconCaching = false;
    }
  }
}

async function clearFaviconCache() {
  await sendMessage('clearImageCache');
  notify.success(t('option.setting.faviconCache.clear.success'));
}

void checkFaviconCachingPermission();
</script>

<template>
  <div class="mx-auto max-w-3xl space-y-8 p-6">
    <SettingSection :title="t('option.setting.section.general')" :icon="Layers">
      <SettingOption
        :label="t('option.setting.panination.label')"
        :description="t('option.setting.panination.description')"
      >
        <Select v-model="setting.pagination">
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem v-for="value in [10, 20, 50]" :key="value" :value>
              {{ t('option.setting.panination.items', { count: value }) }}
            </SelectItem>
          </SelectContent>
        </Select>
      </SettingOption>

      <SettingOption
        :label="t('option.setting.duplicatedUrlOpened.label')"
        :description="t('option.setting.duplicatedUrlOpened.description')"
      >
        <Select v-model="setting.duplicatedUrlOpened">
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="[value, text] in [
                ['focus', t('option.setting.duplicatedUrlOpened.option.focus')],
                ['newTab', t('option.setting.duplicatedUrlOpened.option.newTab')],
                ['ignore', t('option.setting.duplicatedUrlOpened.option.ignore')],
              ] satisfies Array<[DuplicatedUrlOpenedOption, string]>"
              :key="text" :value
            >
              {{ text }}
            </SelectItem>
          </SelectContent>
        </Select>
      </SettingOption>

      <SettingOption
        :label="t('option.setting.showBadge.label')"
        :description="t('option.setting.showBadge.description')"
      >
        <Switch v-model="setting.showBadge" />
      </SettingOption>
    </SettingSection>

    <SettingSection :title="t('option.setting.section.favicon')" :icon="ShieldCheck">
      <SettingOption
        :label="t('option.setting.faviconSource.label')"
        :description="t('option.setting.faviconSource.description')"
      >
        <Select
          v-model="setting.faviconSource"
          @update:model-value="() => updateFaviconCaching(setting.faviconCaching)"
        >
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="[value, text] in [
                ['favicon.im', 'Favicon.im'],
                ['google', 'Google'],
                ['duckduckgo', 'DuckDuckGo']] satisfies Array<[FaviconSource, string]>"
              :key="value" :value="value"
            >
              {{ text }}
            </SelectItem>
          </SelectContent>
        </Select>
      </SettingOption>

      <SettingOption
        :label="t('option.setting.faviconCache.label')"
        :description="t('option.setting.faviconCache.description')"
      >
        <div class="flex items-center gap-4">
          <Button
            v-if="setting.faviconCaching"
            variant="outline" size="sm" class="
              text-destructive transition-all
              hover:bg-destructive/10
            "
            @click="clearFaviconCache"
          >
            <Trash2 /> {{ t('option.setting.faviconCache.clear.label') }}
          </Button>
          <Switch
            :model-value="setting.faviconCaching"
            @update:model-value="updateFaviconCaching"
          />
        </div>
      </SettingOption>
    </SettingSection>

    <SettingSection :title="t('option.setting.section.locale')" :icon="Globe">
      <SettingOption
        :label="t('option.setting.language.label')"
        :description="t('option.setting.language.description')"
      >
        <ToggleGroup
          type="single" class="rounded-lg bg-muted p-1"
          :model-value="setting.locale"
          @update:model-value="(val) => { if (val) setting.locale = val as I18nLocales }"
        >
          <ToggleGroupItem
            v-for="[value, text] in [['en', 'English'], ['zh_CN', '简体中文']] satisfies Array<[I18nLocales, string]>"
            :key="value" :value
            class="
              rounded-md px-4 py-2
              data-[state=on]:bg-background data-[state=on]:shadow-sm
            "
          >
            {{ text }}
          </ToggleGroupItem>
        </ToggleGroup>
      </SettingOption>
    </SettingSection>
  </div>
</template>
