<script setup lang="ts">
import { CloseOutlined, EditOutlined } from '@ant-design/icons-vue';

const emit = defineEmits<{
  (e: 'updateTitleCurrent', id: string): void;
  (e: 'updateUrlToCurrent', id: string): void;
  (e: 'moveToTop', id: string): void;
}>();

const { t } = useI18n();

const menu = useTemplateRef('menu');

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

  void nextTick(() => {
    const menuEl = menu.value;
    if (menuEl === null)
      return;

    const { innerWidth, innerHeight } = window;

    const rect = menuEl.getBoundingClientRect();
    const overflowX = rect.right - innerWidth;
    const overflowY = rect.bottom - innerHeight;

    if (overflowX > 0)
      x.value = Math.floor(x.value - overflowX);
    if (overflowY > 0)
      y.value = Math.floor(y.value - overflowY);
  });
}

function hide() {
  id.value = null;
}

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

function updateTitle() {
  if (id.value === null)
    return;
  emit('updateTitleCurrent', id.value);
  hide();
}

function moveToTop() {
  if (id.value === null)
    return;
  emit('moveToTop', id.value);
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
        <button @click="updateTitle">
          {{ t('contextMenu.editItem.updateTitle') }}
        </button>
      </li>

      <li>
        <button @click="updateUrl">
          {{ t('contextMenu.editItem.updateUrl') }}
        </button>
      </li>

      <li>
        <button @click="moveToTop">
          {{ t('contextMenu.editItem.moveToTop') }}
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

  white-space: nowrap;
  overflow: auto;
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
