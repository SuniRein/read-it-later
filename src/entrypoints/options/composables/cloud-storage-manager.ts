import notify from '@/utils/notify';

export interface CloudFile {
  id: string;
  name: string;
  size: number;
}

export interface CloudService {
  list: () => Promise<CloudFile[]>;
  get: (id: string) => Promise<string>;
  remove: (id: string) => Promise<void>;
  save: (name: string, data: string) => Promise<void>;
  validate: () => Promise<void>;
  preflight: () => Promise<boolean>;
}

export interface CloudManagerEmit {
  (e: 'loadData', data: string): void;
  (e: 'saveLocally', data: string, name: string): void;
}

export function useCloudStorageManager(service: CloudService, emit: CloudManagerEmit) {
  const { t } = useI18n();
  const loadDataModal = ref(false);
  const remoteFiles = ref<CloudFile[] | null>(null);
  const isValidating = ref(false);

  async function save({ name, data }: { name: string; data: string }) {
    if (!(await service.preflight()))
      return;

    try {
      await service.save(name, data);
      notify.success(t('option.data.cloud.msg.saveSuccess'));
    }
    catch (e) {
      notify.error(t('option.data.cloud.msg.saveFailed', { error: e instanceof Error ? e.message : String(e) }));
    }
  }

  async function load() {
    if (!(await service.preflight()))
      return;

    loadDataModal.value = true;
    try {
      remoteFiles.value = (await service.list()).sort((a, b) => a.name < b.name ? 1 : -1);
    }
    catch (e) {
      notify.error(t('option.data.cloud.msg.loadFailed', { error: e instanceof Error ? e.message : String(e) }));
    }
  }

  async function deleteFile(id: string) {
    await service.remove(id);
    remoteFiles.value = remoteFiles.value?.filter(file => file.id !== id) ?? null;
    notify.success(t('option.data.cloud.msg.deleteSuccess'));
  }

  async function loadFile(id: string) {
    const data = await service.get(id);
    emit('loadData', data);
  }

  async function saveFileLocally(id: string, name: string) {
    const data = await service.get(id);
    emit('saveLocally', data, name);
  }

  async function validate() {
    if (!(await service.preflight()))
      return;

    isValidating.value = true;
    try {
      await service.validate();
      notify.success(t('option.data.cloud.msg.validateSuccess'));
    }
    catch (e) {
      notify.error(t('option.data.cloud.msg.validateFailed', { error: e instanceof Error ? e.message : String(e) }));
    }
    finally {
      isValidating.value = false;
    }
  }

  return {
    loadDataModal,
    remoteFiles,
    isValidating,
    save,
    load,
    deleteFile,
    loadFile,
    saveFileLocally,
    validate,
  };
}
