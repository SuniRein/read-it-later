import type { WebDavConfig } from '@/common/types';

import { createClient } from 'webdav';
import { SYNC_FILE_FOLDER, SYNC_FILE_NAME } from './constants';

export async function checkWebDavPermission(url: string): Promise<boolean> {
  return browser.permissions.request({ origins: [url] });
}

export const WEBDAV_AFTER_URL = '/read-it-later-simply';
export const WEBDAV_BACKUP_FOLDER = '/backups';
export const WEBDAV_SYNC_FOLDER = `/${SYNC_FILE_FOLDER}`;

export interface UploadOption {
  path: string;
  filename: string;
  data: string;
}

export function useWebDavService(config: MaybeRef<WebDavConfig>) {
  const mappedConfig = computed(() => ({
    ...unref(config),
    url: unref(config).url?.concat(WEBDAV_AFTER_URL),
  }));

  function connect() {
    const { username, password, url } = mappedConfig.value;
    if (!username || !password || !url) {
      throw new Error('WebDAV configuration is incomplete');
    }
    return createClient(url, { username, password });
  }

  async function validate() {
    const client = connect();
    await client.exists('/');
  }

  async function list() {
    const client = connect();
    return (await client.getDirectoryContents(WEBDAV_BACKUP_FOLDER, { glob: 'read-it-later-*.json' }))
      .map(file => ({
        id: file.filename,
        name: file.basename,
        size: file.size ?? 0,
      }));
  }

  async function save(filename: string, data: string) {
    const client = connect();
    await client.createDirectory(WEBDAV_BACKUP_FOLDER, { recursive: true });
    await client.putFileContents(`${WEBDAV_BACKUP_FOLDER}/${filename}`, data);
  }

  async function get(path: string) {
    const client = connect();
    return (await client.getFileContents(path, { format: 'text' })) as string;
  }

  async function remove(path: string) {
    const client = connect();
    await client.deleteFile(path);
  }

  async function findSyncFile() {
    const client = connect();
    if (!(await client.exists(WEBDAV_SYNC_FOLDER)))
      return null;
    const contents = await client.getDirectoryContents(WEBDAV_SYNC_FOLDER, { glob: SYNC_FILE_NAME });
    if (contents.length === 0)
      return null;
    const file = contents[0];
    return { id: file.filename, name: file.basename, size: file.size ?? 0 };
  }

  async function saveSyncFile(data: string) {
    const client = connect();
    await client.createDirectory(WEBDAV_SYNC_FOLDER, { recursive: true });
    await client.putFileContents(`${WEBDAV_SYNC_FOLDER}/${SYNC_FILE_NAME}`, data);
  }

  return { validate, list, save, get, remove, findSyncFile, saveSyncFile };
}
