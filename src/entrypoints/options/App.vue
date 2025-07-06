<script lang="ts" setup>
import { computed, h } from 'vue';
import { RouterView, useRoute, useRouter } from 'vue-router';

import {
    ConfigProvider,
    Menu,
    Layout,
    LayoutSider,
    LayoutContent,
    type MenuProps,
    theme as antTheme,
} from 'ant-design-vue';
import { SaveOutlined, SettingOutlined } from '@ant-design/icons-vue';

const theme = {
    algorithm: antTheme.defaultAlgorithm,
};

const route = useRoute();
const router = useRouter();

const selectedKeys = computed(() => [route.name as string]);

const items: MenuProps['items'] = [
    {
        key: 'setting',
        label: 'Setting',
        icon: h(SettingOutlined),
    },
    {
        key: 'data',
        label: 'Data',
        icon: h(SaveOutlined),
    },
];

const clickMenuItem: MenuProps['onClick'] = ({ key }) => {
    router.push({ name: key as string });
};
</script>

<template>
    <ConfigProvider :theme>
        <Layout style="min-height: 100vh">
            <LayoutSider class="sider">
                <h2>Read It Later</h2>
                <Menu mode="inline" v-model:selectedKeys="selectedKeys" :items @click="clickMenuItem" class="menu" />
            </LayoutSider>

            <LayoutContent class="content">
                <RouterView v-slot="{ Component }">
                    <KeepAlive>
                        <component :is="Component" :labelSpan="6" :wrapperSpan="14" />
                    </KeepAlive>
                </RouterView>
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
