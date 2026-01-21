<script setup lang="ts">
import { Globe } from 'lucide-vue-next';
import { sendMessage } from '@/utils/message';

const { url, useCache } = defineProps<{
  url?: string;
  useCache?: boolean;
}>();

const imgSrc = ref<string>();
const isLoading = ref(true);
const isError = ref(false);

async function fetchIcon() {
  if (!url) {
    isLoading.value = false;
    return;
  }

  isLoading.value = true;
  isError.value = false;

  try {
    if (useCache) {
      const dataUrl = await sendMessage('fetchImageFromCache', { url });
      imgSrc.value = dataUrl;
    }
    else {
      imgSrc.value = url;
    }
  }
  catch (e) {
    console.error('Failed to fetch favicon:', e);
    isError.value = true;
  }
  finally {
    isLoading.value = false;
  }
}

onMounted(fetchIcon);

watch(() => url, fetchIcon);

function handleImageError() {
  isError.value = true;
  isLoading.value = false;
}
</script>

<template>
  <div
    class="
      relative flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-md border border-black/5
      bg-secondary/50 shadow-sm
      dark:border-white/10
    "
  >
    <div
      v-if="isLoading"
      class="absolute inset-0 animate-pulse bg-muted"
    />

    <img
      v-if="imgSrc && !isError"
      :src="imgSrc"
      class="size-full object-contain p-0.5 transition-opacity duration-300"
      :class="isLoading ? 'opacity-0' : 'opacity-100'"
      @error="handleImageError"
      @load="isLoading = false"
    >

    <Globe
      v-if="isError || (!imgSrc && !isLoading)"
      class="size-3 text-muted-foreground/60"
    />
  </div>
</template>
