<script setup lang="ts">
import type { CloudFile } from '../composables/cloud-storage-manager';
import { CloudDownload, Download, FileJson, Loader2, Trash2 } from 'lucide-vue-next';
import { parseDate, parseSize } from '../utils/file-parse';

defineProps<{
  files: CloudFile[] | null;
}>();

const emit = defineEmits<{
  load: [id: string];
  download: [id: string, name: string];
  delete: [id: string];
}>();

const open = defineModel<boolean>('open', { required: true });

const { t } = useI18n();
</script>

<template>
  <Dialog v-model:open="open">
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

      <div v-if="files === null" class="flex flex-col items-center justify-center gap-4 py-20">
        <Loader2 class="size-8 animate-spin text-muted-foreground" />
        <p class="text-sm text-muted-foreground italic">
          {{ t('option.data.cloud.action.load.loadingStatus') }}
        </p>
      </div>

      <div v-else class="space-y-2 p-4">
        <div
          v-for="file in files"
          :key="file.id"
          class="
            group flex items-center justify-between rounded-lg border bg-card p-3 shadow-sm transition-all
            hover:bg-accent/60
          "
        >
          <div class="flex flex-col gap-1">
            <span class="font-mono text-sm font-medium">{{ parseDate(file.name) }}</span>
            <Badge variant="outline" class="w-fit px-1 py-0 text-[10px] font-normal">
              {{ parseSize(file.size) }}
            </Badge>
          </div>

          <div
            class="
              flex items-center gap-1 opacity-80 transition-opacity
              group-hover:opacity-100
            "
          >
            <Button variant="ghost" size="icon" class="size-8" @click="emit('load', file.id)">
              <CloudDownload />
            </Button>

            <Button
              variant="ghost" size="icon" class="
                size-8 text-blue-500
                hover:text-blue-500
              " @click="emit('download', file.id, file.name)"
            >
              <Download />
            </Button>

            <AlertDialog>
              <AlertDialogTrigger as-child>
                <Button
                  variant="ghost" size="icon" class="
                    size-8 text-destructive
                    hover:text-destructive
                  "
                >
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
                    @click="emit('delete', file.id)"
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
