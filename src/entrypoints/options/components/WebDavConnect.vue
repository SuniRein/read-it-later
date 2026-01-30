<script setup lang="ts">
import type { FileStat } from 'webdav';
import type { WebDavConfig } from '@/utils/types';

import { CloudDownload, Download, FileJson, Globe, Loader2, Lock, Trash2, User } from 'lucide-vue-next';
import notify from '@/utils/notify';
import { AFTER_URL, useWabDavConnect } from '../composables/webdav';
import { parseDate, parseSize } from '../utils/file-parse';

const emit = defineEmits<{
  (e: 'loadData', data: string): void;
  (e: 'saveLocally', data: string, filename: string): void;
}>();

const config = defineModel<WebDavConfig>({ required: true });
const webDav = useWabDavConnect(config);

const { t } = useI18n();

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

const isValidating = ref(false);

async function validate() {
  if (!await checkPermission())
    return;

  isValidating.value = true;

  try {
    await webDav.validate();
  }
  catch (e) {
    if (e instanceof Error) {
      notify.error(e.message);
      return;
    }
  }
  finally {
    isValidating.value = false;
  }

  notify.success(t('option.data.cloud.webdav.msg.validateSuccess'));
}

async function save({ filename, data }: { filename: string; data: string }) {
  if (!await checkPermission())
    return;
  await webDav.save(filename, data);
  notify.success(t('option.data.cloud.webdav.msg.saveSuccess'));
}

const loadDataModel = ref(false);
const remoteFiles = ref<FileStat[] | null>(null);

async function load() {
  if (!await checkPermission())
    return;
  loadDataModel.value = true;
  remoteFiles.value = await webDav.list(); ;
}

async function loadFile(path: string) {
  const data = await webDav.get(path);
  emit('loadData', data);
}

async function deleteFile(path: string) {
  await webDav.remove(path);
  remoteFiles.value = remoteFiles.value?.filter(file => file.filename !== path) ?? null;
}

async function saveFileLocally(item: FileStat) {
  const data = await webDav.get(item.filename);
  emit('saveLocally', data, item.basename);
}

defineExpose({ save, load, validate, isValidating });
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

    <Dialog v-model:open="loadDataModel">
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
            :key="item.basename"
            class="
              group flex items-center justify-between rounded-lg border bg-card p-3 shadow-sm transition-all
              hover:bg-accent/50
            "
          >
            <div class="flex flex-col gap-1">
              <span class="font-mono text-sm font-medium">{{ parseDate(item.basename) }}</span>
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
              <Button variant="ghost" size="icon" class="size-8" @click="loadFile(item.filename)">
                <CloudDownload />
              </Button>

              <Button variant="ghost" size="icon" class="size-8 text-blue-500" @click="saveFileLocally(item)">
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
                      @click="deleteFile(item.filename)"
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
