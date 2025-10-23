<script setup lang="ts">
import { CloseOutlined, EditOutlined } from '@ant-design/icons-vue';
import { onClickOutside } from '@vueuse/core';
import { computed, ref, useTemplateRef } from 'vue';

import useI18n from '@/composables/i18n';

const emit = defineEmits<{
    (e: 'updateUrlToCurrent', id: string): void;
}>();

const { t } = useI18n();

const x = ref(0);
const y = ref(0);
const id = ref<string | null>(null);

const positionStyle = computed(() => ({
    left: `${x.value}px`,
    top: `${y.value}px`,
}));

function show(itemId: string, posX: number, posY: number) {
    id.value = itemId;
    x.value = posX;
    y.value = posY;
}

function hide() {
    id.value = null;
}

const menu = useTemplateRef('menu');
onClickOutside(menu, hide);

defineExpose({
    show,
    hide,
});

function updateUrl() {
    if (id.value === null)
        return;
    emit('updateUrlToCurrent', id.value);
    hide();
}
</script>

<template>
    <div
        v-if="id !== null"
        ref="menu"
        class="context-menu"
        :style="positionStyle"
    >
        <ul class="context" role="menu">
            <li class="section">
                <EditOutlined /> {{ t('contextMenu.editItem.title') }}
            </li>

            <li>
                <button @click="updateUrl">
                    {{ t('contextMenu.editItem.updateUrl') }}
                </button>
            </li>
        </ul>

        <div class="close-button">
            <CloseOutlined @click="hide" />
        </div>
    </div>
</template>

<style scoped>
.context-menu {
    z-index: 1000;
    position: fixed;

    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0px 2px 3px 0 rgba(0, 0, 0, 0.15);
    padding: 2px 0px;
}

.context-menu .close-button {
    position: absolute;
    top: 5px;
    right: 5px;
}

.context-menu .context {
    list-style: none;
    margin: 0;
    padding: 0;
}

.context-menu .context li.section {
    color: #666;
    padding: 2px 10px;
    border-bottom: 1px solid #eee;
    align-items: center;
}

.context-menu .context li button {
    width: 100%;
    padding: 2px 10px;
    border: none;
    background: inherit;
    color: inherit;
    text-align: left;

    &:hover {
        background-color: #f0f0f0;
    }

    &:focus {
        outline: none;
    }
}
</style>
