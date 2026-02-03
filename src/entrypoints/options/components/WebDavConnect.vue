<script setup lang="ts">
import type { CloudManagerEmit } from '../composables/cloud-storage-manager';
import type { WebDavConfig } from '@/utils/types';
import { CloudDownload, Download, FileJson, Globe, Loader2, Lock, Trash2, User } from 'lucide-vue-next';
import notify from '@/utils/notify';
import { useCloudStorageManager } from '../composables/cloud-storage-manager';
import { AFTER_URL, useWabDavService } from '../composables/webdav';
import { parseDate, parseSize } from '../utils/file-parse';

const emit = defineEmits<CloudManagerEmit>();

const { t } = useI18n();

const config = defineModel<WebDavConfig>({ required: true });
const service = {
  ...useWabDavService(config),
  preflight: checkPermission,
};
const { isValidating, loadDataModal, remoteFiles, ...manager } = useCloudStorageManager(service, emit);

async function checkPermission() {
  if (!config.value.url) {
    notify.error(t('option.data.cloud.webdav.msg.urlRequired'));
    return false;
  }

  if (await browser.permissions.request({ origins: [config.value.url] }))
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
          <ButtonGroupText>{{ AFTER_URL }}</ButtonGroupText>
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

    <Dialog v-model:open="loadDataModal">
      <DialogContent
        class="
          gap-0 overflow-hidden p-0
          sm:max-w-125
        "
      >
        <DialogHeader class="p-6 pb-4">
          <DialogTitle class="flex items-center gap-2">
            <FileJson class="size-5 text-primary" /> {{ t('common.action.load') }}
          </DialogTitle>
          <DialogDescription>{{ t('option.data.cloud.action.load.desc') }}</DialogDescription>
        </DialogHeader>

        <Separator />

        <div v-if="remoteFiles === null" class="flex flex-col items-center justify-center gap-4 py-20">
          <Loader2 class="size-8 animate-spin text-primary/50" />
          <p class="text-sm text-muted-foreground italic">
            {{ t('option.data.cloud.action.load.loadingStatus') }}
          </p>
        </div>

        <div v-else class="space-y-2 p-4">
          <div
            v-for="item in remoteFiles"
            :key="item.id"
            class="
              group flex items-center justify-between rounded-lg border bg-card p-3 shadow-sm transition-all
              hover:bg-accent/50
            "
          >
            <div class="flex flex-col gap-1">
              <span class="font-mono text-sm font-medium">{{ parseDate(item.name) }}</span>
              <Badge variant="outline" class="w-fit px-1 py-0 text-[10px] font-normal">
                {{ parseSize(item.size) }}
              </Badge>
            </div>

            <div
              class="
                flex items-center gap-1 opacity-80 transition-opacity
                group-hover:opacity-100
              "
            >
              <Button variant="ghost" size="icon" class="size-8" @click="manager.loadFile(item.id)">
                <CloudDownload />
              </Button>

              <Button variant="ghost" size="icon" class="size-8 text-blue-500" @click="manager.saveFileLocally(item.id, item.name)">
                <Download />
              </Button>

              <AlertDialog>
                <AlertDialogTrigger as-child>
                  <Button variant="ghost" size="icon" class="size-8 text-destructive">
                    <Trash2 />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{{ t('option.data.cloud.msg.confirmDelete.title') }}</AlertDialogTitle>
                    <AlertDialogDescription>{{ t('option.data.cloud.msg.confirmDelete.desc') }}</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{{ t('common.action.cancel') }}</AlertDialogCancel>
                    <AlertDialogAction
                      class="
                        bg-destructive
                        hover:bg-destructive/80
                      "
                      @click="manager.deleteFile(item.id)"
                    >
                      {{ t('common.action.confirm') }}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>
