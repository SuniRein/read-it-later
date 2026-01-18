<script setup lang="ts">
import type { FileStat, WebDAVClient } from 'webdav';
import type { WebDavConfig } from '@/utils/types';

import { browser } from '#imports';
import { Button, Form, FormItem, Input, InputPassword, List, ListItem, Modal, Popconfirm, Space, Spin } from 'ant-design-vue';

import { computed, ref, useTemplateRef } from 'vue';
import useI18n from '@/composables/i18n';
import notify from '@/utils/notify';
import WebDav from '@/utils/webdav';

defineProps<{ buttonWrapperCol: { offset: number } }>();

const emit = defineEmits<{
  (e: 'loadData', data: string): void;
  (e: 'saveLocally', data: string, filename: string): void;
}>();

const AFTER_URL = '/read-it-later-simply';

const config = defineModel<WebDavConfig>({ required: true });
const webdavConfig = computed(() => {
  return {
    ...config.value,
    url: config.value.url?.concat(AFTER_URL),
  };
});

const { t } = useI18n();

const formRef = useTemplateRef('form');

async function checkPermission(url?: string) {
  try {
    await (formRef.value as any).validate();
  }
  catch {
    return false;
  }

  if (url === undefined || !url) {
    notify.error(t('option.data.cloudStorage.webdav.message.urlRequired'));
    return false;
  }

  if (await browser.permissions.request({ origins: [url] }))
    return true;
  notify.error(t('option.data.cloudStorage.webdav.message.permissionDenied'));
  return false;
}

async function validate() {
  if (!await checkPermission(webdavConfig.value.url))
    return;

  const client = WebDav.connect(webdavConfig.value);
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

async function save({ filename, data }: { filename: string; data: string }) {
  if (!await checkPermission(webdavConfig.value.url))
    return;

  const client = WebDav.connect(webdavConfig.value);
  await WebDav.createFolder(client, '/backups');
  await WebDav.uploadFile(client, {
    path: '/backups',
    filename,
    data,
  });

  notify.success(t('option.data.cloudStorage.webdav.message.saveSuccess'));
}

const loadDataModel = ref(false);
const remoteFiles = ref<FileStat[] | null>(null);
let remoteClient: WebDAVClient | null = null;

async function load() {
  if (!await checkPermission(webdavConfig.value.url))
    return;

  loadDataModel.value = true;
  remoteFiles.value = null;

  remoteClient = WebDav.connect(webdavConfig.value);
  remoteFiles.value = (await WebDav.listDirectory(remoteClient, '/backups', 'read-it-later-*.json'))
    .sort((a, b) => a.basename < b.basename ? -1 : 1);
}

function parseData(filename: string) {
  const m = filename.match(/\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z/);
  if (m) {
    const iso = m[0].replace(/^(\d{4}-\d{2}-\d{2}T)(\d{2})-(\d{2})-(\d{2})-(\d{3})Z$/, '$1$2:$3:$4.$5Z');
    const date = new Date(iso);
    return date.toLocaleString();
  }

  console.error(`Filename ${filename} does not match expected format.`);
}

function parseSize(size: number) {
  const units = ['B', 'KB', 'MB', 'GB'];
  while (size >= 1024 && units.length > 1) {
    size /= 1024;
    units.shift();
  }
  return `${size.toFixed(2)} ${units[0]}`;
}

async function loadFile(path: string) {
  const data = await WebDav.getFile(remoteClient!, path);
  emit('loadData', data);
}

async function deleteFile(path: string) {
  await remoteClient!.deleteFile(path);
  remoteFiles.value = remoteFiles.value?.filter(file => file.filename !== path) ?? null;
}

async function saveFileLocally(item: FileStat) {
  const data = await WebDav.getFile(remoteClient!, item.filename);
  emit('saveLocally', data, item.basename);
}

defineExpose({ save, load });
</script>

<template>
  <Form ref="form" :model="config" class="webdav-config" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
    <FormItem
      :label="t('option.data.cloudStorage.webdav.url')"
      name="url"
      :rules="{
        pattern: /^http[s]:\/\/.+$/,
        whitespace: false,
        required: true,
        message: t('option.data.cloudStorage.webdav.message.urlInvalid'),
      }"
      has-feedback
    >
      <Input v-model:value="config.url" :addon-after="AFTER_URL" />
    </FormItem>

    <FormItem name="username" :label="t('option.data.cloudStorage.webdav.username')">
      <Input v-model:value="config.username" />
    </FormItem>

    <FormItem name="password" :label="t('option.data.cloudStorage.webdav.password')">
      <InputPassword v-model:value="config.password" />
    </FormItem>

    <FormItem :wrapper-col="buttonWrapperCol">
      <Button type="primary" @click="validate">
        {{ t('option.data.cloudStorage.webdav.validate') }}
      </Button>
    </FormItem>
  </Form>

  <Modal v-model:open="loadDataModel" centered :footer="null">
    <div v-if="remoteFiles === null" style="text-align: center;">
      <Spin />
    </div>

    <List v-else :data-source="remoteFiles" size="small">
      <template #renderItem="{ item }: {item: FileStat}">
        <ListItem :key="item.basename" class="file-list">
          <span class="file-date">{{ parseData(item.basename) }}</span>

          <span class="file-size">{{ parseSize(item.size) }} </span>

          <div class="file-action">
            <Space>
              <Button size="small" @click="() => loadFile(item.filename)">
                {{ t('option.data.load') }}
              </Button>

              <Popconfirm
                :title="t('option.data.cloudStorage.webdav.message.confirmDelete')"
                @confirm="() => deleteFile(item.filename)"
              >
                <Button size="small">
                  {{ t('option.data.delete') }}
                </Button>
              </Popconfirm>

              <Button size="small" @click="() => saveFileLocally(item)">
                {{ t('option.data.saveLocally') }}
              </Button>
            </Space>
          </div>
        </ListItem>
      </template>
    </List>
  </Modal>
</template>

<style scoped>
.webdav-config {
  margin: 16px auto;
  padding-top: 32px;
  width: fit-content;
  min-width: 60%;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
}

.file-list {
  display: flex;
}

.file-date {
  flex: 3;
}

.file-size {
  flex: 2;
  text-align: center;
}

.file-action {
  flex: 5;
  text-align: right;
}
</style>
