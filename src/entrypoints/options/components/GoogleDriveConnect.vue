<script setup lang="ts">
import type { GoogleDriveFile } from '../utils/google-drive-api';
import type { GoogleDriveConfig } from '@/utils/types';
import { Cloud, CloudDownload, CloudOff, Download, FileJson, Loader2, RefreshCw, Trash2 } from 'lucide-vue-next';
import notify from '@/utils/notify';
import { useGoogleDriveConnect } from '../composables/google-drive';
import { parseDate, parseSize } from '../utils/file-parse';

const emit = defineEmits<{
  (e: 'loadData', data: string): void;
  (e: 'saveLocally', data: string, filename: string): void;
}>();

const { t } = useI18n();

const config = defineModel<GoogleDriveConfig | null>({ required: true });
const googleDrive = useGoogleDriveConnect(config);
const isPending = ref(false);

async function handleSignIn() {
  isPending.value = true;
  try {
    await googleDrive.signIn();
  }
  catch (e) {
    if (e instanceof Error) {
      notify.error(t('option.data.cloud.googleDrive.msg.authFailed', { error: e.message }));
      return;
    }
  }
  finally {
    isPending.value = false;
  }

  notify.success(t('option.data.cloud.googleDrive.msg.authSuccess'));
}

function checkConnection() {
  if (!config.value) {
    notify.error(t('option.data.cloud.googleDrive.msg.notConnected'));
    return false;
  }
  return true;
}

async function save({ filename, data }: { filename: string; data: string }) {
  if (!checkConnection())
    return;
  await googleDrive.save(filename, data);
  notify.success(t('option.data.cloud.googleDrive.msg.saveSuccess'));
}

const loadDataModel = ref(false);
const remoteFiles = ref<GoogleDriveFile[] | null>(null);

async function load() {
  if (!checkConnection())
    return;
  loadDataModel.value = true;
  remoteFiles.value = await googleDrive.list(); ;
}

async function deleteFile(id: string) {
  await googleDrive.remove(id);
  remoteFiles.value = remoteFiles.value?.filter(file => file.id !== id) ?? null;
}

async function loadFile(id: string) {
  const data = await googleDrive.get(id);
  emit('loadData', data);
}

async function saveFileLocally(item: GoogleDriveFile) {
  const data = await googleDrive.get(item.id);
  emit('saveLocally', data, item.name);
}

const isValidating = ref(false);

async function validate() {
  if (!checkConnection())
    return;

  isValidating.value = true;

  try {
    await googleDrive.validate();
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

  notify.success(t('option.data.cloud.googleDrive.msg.validateSuccess'));
}

defineExpose({
  save,
  load,
  validate,
  isValidating,
});
</script>

<template>
  <div class="flex w-full items-center justify-between py-4">
    <div class="flex items-center gap-3">
      <div
        class="flex size-10 items-center justify-center rounded-full bg-secondary/50"
        :class="{ 'text-primary': config, 'text-muted-foreground': !config }"
      >
        <Cloud v-if="config" class="size-5" />
        <CloudOff v-else class="size-5" />
      </div>

      <div class="flex flex-col">
        <span class="text-sm leading-none font-semibold">
          {{ t('option.data.cloud.googleDrive.title') }}
        </span>
        <p class="mt-1 text-[12px] text-muted-foreground">
          <span v-if="isPending" class="flex items-center gap-1">
            <RefreshCw class="size-3 animate-spin" /> {{ t('option.data.cloud.googleDrive.desc.pending') }}
          </span>
          <span v-else-if="config" class="flex items-center gap-1">
            {{ t('option.data.cloud.googleDrive.desc.signedIn', { email: config.email }) }}
          </span>
          <span v-else>
            {{ t('option.data.cloud.googleDrive.desc.signedOut') }}
          </span>
        </p>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <Button
        v-if="config === null"
        size="sm"
        variant="outline"
        class="
          h-9 rounded-full px-4 transition-all
          hover:bg-primary hover:text-primary-foreground
        "
        :disabled="isPending"
        @click="handleSignIn"
      >
        <Loader2 v-if="isPending" class="animate-spin" /> 立即授权
      </Button>

      <Button
        v-else
        size="sm"
        variant="outline"
        class="
          h-9 rounded-full px-3 text-destructive
          hover:bg-destructive/10 hover:text-destructive
        "
        @click="googleDrive.signOut"
      >
        断开连接
      </Button>
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
            <Button variant="ghost" size="icon" class="size-8" @click="loadFile(item.id)">
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
                    @click="deleteFile(item.id)"
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
</template>
