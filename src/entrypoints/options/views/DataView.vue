<script setup lang="ts">
import type { CloudStorageType } from '@/utils/types';

import { CheckCircle2, Cloud, Download, Globe, Loader2, Trash2, Upload } from 'lucide-vue-next';
import { usePageList } from '@/composables/page-list';
import notify from '@/utils/notify';
import { deserializePageList, serializePageList } from '@/utils/page-list-serializatoin';

import WebDavConnect from '../components/WebDavConnect.vue';
import { useSetting } from '../composables/setting';

const { t } = useI18n();

const { setting } = await useSetting();

const { pageList, load, clear } = usePageList();

function getData() {
  const data = serializePageList(pageList.value);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `read-it-later-${timestamp}.json`;
  return { data, filename };
}

async function saveLocally(data: string, filename: string) {
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  await browser.downloads.download({ url, filename, saveAs: true });
  URL.revokeObjectURL(url);
}

async function saveToLocalStorage() {
  const { data, filename } = getData();
  await saveLocally(data, filename);
}

const localInputRef = useTemplateRef('localInputRef');

function handleLocalFileChange(e: Event) {
  const files = (e.target as HTMLInputElement).files;
  if (files && files.length > 0) {
    loadFromFile(files[0]);
  }
  else {
    notify.error(t('errorMsg.noUploadFile'));
  }
};

function loadFromFile(file: File) {
  const reader = new FileReader();
  reader.onload = (event) => {
    if (event.target?.result != null) {
      loadItems(event.target.result as string);
    }
  };
  reader.readAsText(file);
}

function loadItems(rawItems: string) {
  try {
    const items = deserializePageList(rawItems);
    const numLoad = load(items);
    notify.success(t('successMsg.loadData', { count: numLoad }));
  }
  catch (error) {
    notify.error(t('errorMsg.parseError', { error }));
  }
}

const cloudStorageRef = useTemplateRef('cloudStorageRef');

function clearBrowserData() {
  clear();
}
</script>

<template>
  <div class="mx-auto max-w-3xl space-y-8 p-6">
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2 text-lg">
          <Download class="size-5" /> {{ t('option.data.section.local.title') }}
        </CardTitle>
        <CardDescription>{{ t('option.data.section.local.description') }}</CardDescription>
      </CardHeader>

      <CardContent class="flex gap-4">
        <Button variant="outline" class="flex-1" @click="saveToLocalStorage">
          <Download /> {{ t('option.data.action.save') }}
        </Button>
        <div class="flex-1">
          <Button variant="outline" class="w-full" @click="localInputRef?.click()">
            <Upload /> {{ t('option.data.action.load') }}
          </Button>
          <input ref="localInputRef" type="file" accept=".json" class="hidden" @change="handleLocalFileChange">
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2 text-lg">
          <Cloud class="size-5" /> {{ t('option.data.section.cloud.title') }}
        </CardTitle>
        <CardDescription>{{ t('option.data.section.cloud.description') }}</CardDescription>
      </CardHeader>

      <CardContent class="space-y-6">
        <ToggleGroup
          class="w-full border" type="single"
          :model-value="setting.cloudStorage"
          @update:model-value="(val) => { if (val) setting.cloudStorage = val as CloudStorageType }"
        >
          <ToggleGroupItem :value="'none' satisfies CloudStorageType" class="flex-1">
            {{ t('option.data.cloud.option.none') }}
          </ToggleGroupItem>
          <ToggleGroupItem :value="'webdav' satisfies CloudStorageType" class="flex-1">
            {{ t('option.data.cloud.option.webdav') }}
          </ToggleGroupItem>
        </ToggleGroup>

        <div v-if="setting.cloudStorage === 'webdav'" class="border-t pt-6">
          <WebDavConnect
            ref="cloudStorageRef"
            v-model="setting.webDavConfig"
            :button-wrapper-col="{ offset: 14 }"
            @load-data="loadItems"
            @save-locally="saveLocally"
          />
        </div>
      </CardContent>

      <CardFooter v-if="setting.cloudStorage !== 'none'" class="flex justify-end gap-3">
        <Button variant="secondary" :disabled="cloudStorageRef?.isValidating" @click="cloudStorageRef?.validate()">
          <Loader2 v-if="cloudStorageRef?.isValidating" class="size-4 animate-spin" />
          <CheckCircle2 v-else class="size-4 text-green-500" />
          {{ t('option.data.cloud.webdav.validate') }}
        </Button>
        <Button variant="secondary" @click="cloudStorageRef?.load()">
          {{ t('option.data.action.load') }}
        </Button>
        <Button @click="cloudStorageRef?.save(getData())">
          {{ t('option.data.action.save') }}
        </Button>
      </CardFooter>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2 text-lg">
          <Globe class="size-5" /> {{ t('option.data.section.browser.title') }}
        </CardTitle>
        <CardDescription>{{ t('option.data.section.browser.description') }}</CardDescription>
      </CardHeader>

      <CardContent>
        <AlertDialog>
          <AlertDialogTrigger as-child>
            <Button variant="destructive">
              <Trash2 /> {{ t('option.data.action.clear') }}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{{ t('option.data.message.confirmClear.title') }}</AlertDialogTitle>
              <AlertDialogDescription>{{ t('option.data.message.confirmClear.description') }}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{{ t('common.cancel') }}</AlertDialogCancel>
              <AlertDialogAction
                class="
                  bg-destructive
                  hover:bg-destructive/80
                "
                @click="clearBrowserData"
              >
                {{ t('common.confirm') }}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  </div>
</template>
