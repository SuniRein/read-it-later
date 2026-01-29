<script setup lang="ts">
import type { GoogleDriveConfig } from '@/utils/types';
import { Cloud, CloudOff, Loader2, RefreshCw } from 'lucide-vue-next';
import notify from '@/utils/notify';
import { useGoogleDriveConnect } from '../composables/google-drive';

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
</template>
