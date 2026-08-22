import type { BackgroundContext } from '../context';
import type { CloudService } from '@/services/cloud/types';
import type { SyncRunResult } from '@/services/sync/runner';
import { onMessage } from '@/common/message';
import { useGoogleDriveService } from '@/services/cloud/google-drive';
import { useWebDavService } from '@/services/cloud/webdav';
import { runSync } from '@/services/sync/runner';

const SYNC_DEBOUNCE_MS = 3000;
const SYNC_ALARM_NAME = 'read-it-later-sync';
const SYNC_ALARM_PERIOD_MINUTES = 5;

export function installSync(ctx: BackgroundContext): void {
  const { items, settings } = ctx;
  let timer: number | undefined;
  let running = false;

  function scheduleAutoSync() {
    clearTimeout(timer);
    timer = window.setTimeout(() => {
      void runAutoSync();
    }, SYNC_DEBOUNCE_MS);
  }

  function enabled() {
    return settings.setting.value.cloudSyncEnabled;
  }

  // webdav preflight uses permissions.contains so automatic sync never pops
  // the permission prompt (needs a user gesture); drive's computed carries a
  // setter so token refresh writes back to persisted settings.
  async function buildService(): Promise<CloudService | null> {
    const s = settings.setting.value;
    if (s.cloudStorage === 'webdav') {
      if (!s.webDavConfig.url)
        return null;
      const url = s.webDavConfig.url;
      return {
        ...useWebDavService(computed(() => settings.setting.value.webDavConfig)),
        preflight: async () => browser.permissions.contains({ origins: [url] }),
      };
    }
    if (s.cloudStorage === 'google-drive') {
      if (!s.googleDriveConfig)
        return null;
      return {
        ...useGoogleDriveService(computed({
          get: () => settings.setting.value.googleDriveConfig,
          set: (v) => { settings.setting.value.googleDriveConfig = v; },
        })),
        preflight: async () => settings.setting.value.googleDriveConfig !== null,
      };
    }
    return null;
  }

  async function runAutoSync() {
    if (running)
      return;
    if (!enabled())
      return;
    running = true;
    try {
      const service = await buildService();
      if (!service)
        return;
      const result = await runSync({ items, service, syncLog: ctx.syncLog });
      if (result.status === 'failed') {
        console.warn('[sync] auto sync failed:', result.error);
      }
      if (result.status === 'synced') {
        const log = await items.syncLog.getValue();
        if (log.length > 0)
          scheduleAutoSync();
      }
    }
    finally {
      running = false;
    }
  }

  // Periodic fallback: only fires when enabled() and there is something to do.
  void browser.alarms.create(SYNC_ALARM_NAME, { periodInMinutes: SYNC_ALARM_PERIOD_MINUTES });
  browser.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === SYNC_ALARM_NAME)
      void runAutoSync();
  });

  onMessage('syncNow', async (): Promise<SyncRunResult> => {
    if (!enabled())
      return { status: 'skipped' };
    const service = await buildService();
    if (!service)
      return { status: 'skipped' };
    return runSync({ items, service, syncLog: ctx.syncLog }, { force: true });
  });

  items.syncLog.watch((log) => {
    if (log.length > 0 && enabled())
      scheduleAutoSync();
  });
  // SW restart with leftover log: check once on install.
  void items.syncLog.getValue().then((log) => {
    if (log.length > 0 && enabled())
      scheduleAutoSync();
  });
}
