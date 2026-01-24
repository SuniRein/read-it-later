<script lang="ts" setup>
import { Home, Save, Settings } from 'lucide-vue-next';

const { t } = useI18n();

const navItems = computed(() => [
  { key: 'setting', label: t('option.nav.setting'), icon: Settings },
  { key: 'data', label: t('option.nav.data'), icon: Save },
  { key: 'about', label: t('option.nav.about'), icon: Home },
]);
</script>

<template>
  <div class="flex h-screen bg-background text-foreground">
    <aside class="w-56 flex-col border-r">
      <div class="p-4">
        <h1 class="text-2xl font-bold tracking-tight">
          {{ t('common.title') }}
        </h1>
      </div>
      <div class="flex-1 px-2">
        <nav class="space-y-2">
          <RouterLink v-for="item in navItems" :key="item.key" :to="{ name: item.key }" custom>
            <template #default="{ navigate, isActive }">
              <Button
                :variant="isActive ? 'secondary' : 'ghost'"
                class="w-full justify-start"
                @click="navigate"
              >
                <component :is="item.icon" class="mr-2 size-4" />
                {{ item.label }}
              </Button>
            </template>
          </RouterLink>
        </nav>
      </div>
    </aside>

    <main class="flex-1 overflow-hidden">
      <Suspense>
        <ScrollArea class="h-full p-4">
          <RouterView />
        </ScrollArea>
      </Suspense>
    </main>

    <Sonner rich-colors position="top-center" />
  </div>
</template>
