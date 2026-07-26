import { createStorageItems } from '@/storage';
import { createBackgroundContext } from './context';
import { installActivePageActions } from './modules/active-page-actions';
import { installBadge } from './modules/badge';
import { installCommand } from './modules/command';
import { installConnection } from './modules/connection';
import { installContextMenu } from './modules/context-menu';
import { installCurrentTab } from './modules/current-tab';
import { installImageCache } from './modules/image-cache';
import { installMigrations } from './modules/migrations';
import { installNotify } from './modules/notify';
import { installPageOpener } from './modules/page-opener';

export default defineBackground(() => {
  const items = createStorageItems();
  const ctx = createBackgroundContext(items);

  installConnection(ctx);
  installCurrentTab(ctx);
  installNotify(ctx);
  installBadge(ctx);
  installPageOpener(ctx);
  installActivePageActions(ctx);
  installCommand(ctx);
  installContextMenu(ctx);
  installImageCache(ctx);
  installMigrations(ctx);
});
