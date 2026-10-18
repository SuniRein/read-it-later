import type { BackgroundContext } from '../context';
import type { PageItem, Setting } from '@/common/types';
import type { StorageItems } from '@/storage';
import { changeLog } from '@/common/meta';

type MigrationStorageItems = Pick<StorageItems, 'pageList' | 'archivedPageList' | 'setting'>;
type SettingStorageItems = Pick<StorageItems, 'setting'>;

interface Migration {
  version: string;
  run: (items: MigrationStorageItems) => Promise<void>;
}

async function updateSettings(items: SettingStorageItems, newSettings: Partial<Setting>) {
  const oldSetting = await items.setting.getValue();
  await items.setting.setValue({
    ...oldSetting,
    ...newSettings,
  });
}

/**
 * Move the legacy session-scoped removed list into the persistent archive.
 * Entries already present locally (by id or url) win, so re-running is a no-op.
 */
export async function migrateArchivedPageList(
  items: Pick<StorageItems, 'archivedPageList'>,
): Promise<void> {
  const sessionRemoved = await storage.getItem<PageItem[]>('session:removedPageList');
  if (!Array.isArray(sessionRemoved))
    return; // no legacy data (or an unexpected shape): leave storage untouched

  const localArchived = await items.archivedPageList.getValue();
  const seenIds = new Set(localArchived.map(item => item.id));
  const seenUrls = new Set(localArchived.map(item => item.info.url));
  const merged = [...localArchived];

  for (const item of sessionRemoved) {
    if (seenIds.has(item.id) || seenUrls.has(item.info.url))
      continue;
    seenIds.add(item.id);
    seenUrls.add(item.info.url);
    merged.push(item);
  }

  await items.archivedPageList.setValue(merged);
  await storage.removeItem('session:removedPageList');
}

const migrations: Migration[] = [
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
    run: async (items: SettingStorageItems) => {
      await updateSettings(items, {
        randomPageIgnoreOpened: false,
        openAndRemove: false,
        addAndClose: false,
      });
    },
  },
  {
    version: '0.18.0',
    run: async (items: SettingStorageItems) => {
      await updateSettings(items, { colorMode: 'auto' });
    },
  },
  {
    version: '0.19.0',
    run: async (items: SettingStorageItems) => {
      await updateSettings(items, { fontSize: 'normal' });
    },
  },
  {
    version: '0.20.0',
    run: async (items: SettingStorageItems) => {
      await updateSettings(items, { cloudSyncEnabled: false });
    },
  },
  {
    version: '0.22.0',
    run: async (items: MigrationStorageItems) => {
      await updateSettings(items, { showContextMenu: true });
      await migrateArchivedPageList(items);
    },
  },
];

export async function handleUpdate(items: MigrationStorageItems, previousVersion: string) {
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

export function installMigrations(ctx: BackgroundContext): void {
  browser.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === 'update')
      await handleUpdate(ctx.items, details.previousVersion!);
  });
}
