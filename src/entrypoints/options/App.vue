<script lang="ts" setup>
import type { MenuProps } from 'ant-design-vue';

import { HomeOutlined, SaveOutlined, SettingOutlined } from '@ant-design/icons-vue';
import {
    theme as antTheme,
    ConfigProvider,
    Layout,
    LayoutContent,
    LayoutSider,
    Menu,
} from 'ant-design-vue';
import { computed, h } from 'vue';
import { RouterView, useRoute, useRouter } from 'vue-router';

import useI18n, { useAntLocale } from '@/composables/i18n';

const theme = {
    algorithm: antTheme.defaultAlgorithm,
};

const route = useRoute();
const router = useRouter();

const { t, locale } = useI18n();
const antLocale = useAntLocale(locale);

const selectedKeys = computed(() => [route.name as string]);

const items = computed<MenuProps['items']>(() => [
    {
        key: 'setting',
        label: t('option.nav.setting'),
        icon: h(SettingOutlined),
    },
    {
        key: 'data',
        label: t('option.nav.data'),
        icon: h(SaveOutlined),
    },
    {
        key: 'about',
        label: t('option.nav.about'),
        icon: h(HomeOutlined),
    },
]);

const clickMenuItem: MenuProps['onClick'] = ({ key }) => {
    router.push({ name: key as string });
};
</script>

<template>
    <ConfigProvider :theme :locale="antLocale">
        <Layout style="min-height: 100vh">
            <LayoutSider class="sider">
                <h2>{{ t('option.title') }}</h2>
                <Menu :selected-keys="selectedKeys" mode="inline" :items class="menu" @click="clickMenuItem" />
            </LayoutSider>

            <LayoutContent class="content">
                <Suspense>
                    <RouterView v-slot="{ Component }">
                        <component :is="Component" :label-span="6" :wrapper-span="14" />
                    </RouterView>
                </Suspense>
            </LayoutContent>
        </Layout>
    </ConfigProvider>
</template>

<style scoped>
.sider {
    background-color: #fff;
}

.sider h2 {
    padding: 16px;
    margin: 0;
    font-size: 20px;
    font-weight: bold;
}

.menu {
    border-right: none !important;
}

.content {
    padding: 16px;
}
</style>
