import type { StorageItems } from '@/storage';
import type { Setting } from '@/utils/types';
import { changeLog } from '@/utils/meta';

async function updateSettings(items: Pick<StorageItems, 'setting'>, newSettings: Partial<Setting>) {
  const oldSetting = await items.setting.getValue();
  await items.setting.setValue({
    ...oldSetting,
    ...newSettings,
  });
}

const migrations = [
  {
    version: '0.15.0',
    run: async (items: Pick<StorageItems, 'pageList' | 'setting'>) => {
      await updateSettings(items, { googleDriveConfig: null });

      const oldPageList = await items.pageList.getValue();
      await items.pageList.setValue(oldPageList.map(page => ({
        ...page,
        desc: '',
      })));
    },
  },
  {
    version: '0.17.0',
    run: async (items: Pick<StorageItems, 'setting'>) => {
      await updateSettings(items, {
        randomPageIgnoreOpened: false,
        openAndRemove: false,
        addAndClose: false,
      });
    },
  },
  {
    version: '0.18.0',
    run: async (items: Pick<StorageItems, 'setting'>) => {
      await updateSettings(items, { colorMode: 'auto' });
    },
  },
  {
    version: '0.19.0',
    run: async (items: Pick<StorageItems, 'setting'>) => {
      await updateSettings(items, { fontSize: 'normal' });
    },
  },
];

export async function handleUpdate(items: Pick<StorageItems, 'pageList' | 'setting'>, previousVersion: string) {
  const currentVersion = browser.runtime.getManifest().version;

  for (const mig of migrations) {
    if (!isVersionGreater(mig.version, currentVersion)
      && isVersionGreater(mig.version, previousVersion)) {
      try {
        await mig.run(items);
      }
      catch (e) {
        console.error(`Migration to version ${mig.version} failed:`, e);
      }
    }
  }

  // open change log page after update
  await browser.tabs.create({ url: changeLog });
}

function isVersionGreater(v1: string, v2: string): boolean {
  return v1.localeCompare(v2, undefined, { numeric: true, sensitivity: 'base' }) > 0;
}
