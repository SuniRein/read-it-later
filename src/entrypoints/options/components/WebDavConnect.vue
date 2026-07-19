<script setup lang="ts">
import type { WebDavConfig } from '@/common/types';
import type { CloudStorageEmit } from '@/services/cloud/cloud-storage';
import { Globe, Lock, User } from 'lucide-vue-next';
import notify from '@/common/notify';
import { useCloudStorageManager } from '@/services/cloud/cloud-storage';
import { checkWebDavPermission, useWebDavService, WEBDAV_AFTER_URL } from '@/services/cloud/webdav';

const emit = defineEmits<CloudStorageEmit>();

const { t } = useI18n();

const config = defineModel<WebDavConfig>({ required: true });
const service = {
  ...useWebDavService(config),
  preflight: checkPermission,
};
const { isValidating, loadDataModal, remoteFiles, ...manager } = useCloudStorageManager(service, emit);

async function checkPermission() {
  if (!config.value.url) {
    notify.error(t('option.data.cloud.webdav.msg.urlRequired'));
    return false;
  }

  if (await checkWebDavPermission(config.value.url))
    return true;
  notify.error(t('option.data.cloud.webdav.msg.permissionDenied'));
  return false;
}

defineExpose({
  save: manager.save,
  load: manager.load,
  validate: manager.validate,
  isValidating,
});
</script>

<template>
  <div class="animate-in space-y-6 duration-300 fade-in slide-in-from-top-2">
    <div class="grid gap-6 py-4">
      <div class="grid gap-2">
        <Label for="url" class="flex items-center gap-2">
          <Globe class="size-4 text-muted-foreground" /> {{ t('option.data.cloud.webdav.field.url') }}
        </Label>
        <ButtonGroup class="w-full gap-0!">
          <Input id="url" v-model="config.url" placeholder="https://example.com/dav" />
          <ButtonGroupText>{{ WEBDAV_AFTER_URL }}</ButtonGroupText>
        </ButtonGroup>
      </div>

      <div
        class="
          grid grid-cols-1 gap-4
          md:grid-cols-2
        "
      >
        <div class="grid gap-2">
          <Label for="username" class="flex items-center gap-2">
            <User class="size-4 text-muted-foreground" /> {{ t('option.data.cloud.webdav.field.username') }}
          </Label>
          <Input id="username" v-model="config.username" />
        </div>
        <div class="grid gap-2">
          <Label for="password" class="flex items-center gap-2">
            <Lock class="size-4 text-muted-foreground" /> {{ t('option.data.cloud.webdav.field.password') }}
          </Label>
          <Input id="password" v-model="config.password" type="password" />
        </div>
      </div>
    </div>
  </div>

  <CloudFileSelector
    v-model:open="loadDataModal"
    :files="remoteFiles"
    @load="manager.loadFile"
    @download="manager.saveFileLocally"
    @delete="manager.deleteFile"
  />
</template>
