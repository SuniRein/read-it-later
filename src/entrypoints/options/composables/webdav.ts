import type { FileStat } from 'webdav';
import type { WebDavConfig } from '@/utils/types';

import { createClient } from 'webdav';

export const AFTER_URL = '/read-it-later-simply';
export const BACKUP_FOLDER = '/backups';

export interface UploadOption {
  path: string;
  filename: string;
  data: string;
}

export function useWabDavConnect(config: MaybeRef<WebDavConfig>) {
  const mappedConfig = computed(() => ({
    ...unref(config),
    url: unref(config).url?.concat(AFTER_URL),
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
    return (await client.getDirectoryContents(BACKUP_FOLDER, { glob: 'read-it-later-*.json' }) as FileStat[])
      .sort((a, b) => a.basename < b.basename ? -1 : 1);
  }

  async function save(filename: string, data: string) {
    const client = connect();
    await client.createDirectory(BACKUP_FOLDER, { recursive: true });
    await client.putFileContents(`${BACKUP_FOLDER}/${filename}`, data);
  }

  async function get(path: string) {
    const client = connect();
    return (await client.getFileContents(path, { format: 'text' })) as string;
  }

  async function remove(path: string) {
    const client = connect();
    await client.deleteFile(path);
  }

  return { validate, list, save, get, remove };
}
