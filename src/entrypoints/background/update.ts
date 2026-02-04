import store from '@/utils/store';

const migrations = [
  {
    version: '0.15.0',
    run: async () => {
      const oldSetting = await store.setting.getValue();
      await store.setting.setValue({
        ...oldSetting,
        googleDriveConfig: null,
      });

      const oldPageList = await store.pageList.getValue();
      await store.pageList.setValue(oldPageList.map(page => ({
        ...page,
        desc: '',
      })));
    },
  },
];

export function handleUpdate() {
  browser.runtime.onInstalled.addListener(async (details) => {
    if (details.reason !== 'update')
      return;

    const previousVersion = details.previousVersion!;
    const currentVersion = browser.runtime.getManifest().version;

    for (const mig of migrations) {
      if (!isVersionGreater(mig.version, currentVersion)
        && isVersionGreater(mig.version, previousVersion)) {
        try {
          await mig.run();
        }
        catch (e) {
          console.error(`Migration to version ${mig.version} failed:`, e);
        }
      }
    }
  },
  );
}

function isVersionGreater(v1: string, v2: string): boolean {
  return v1.localeCompare(v2, undefined, { numeric: true, sensitivity: 'base' }) > 0;
}
