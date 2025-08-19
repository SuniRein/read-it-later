import type { WebDAVClient } from 'webdav';
import type { WebDavConfig } from '@/utils/types';

import { createClient } from 'webdav';

function connect(config: WebDavConfig) {
    const { username, password, url } = config;
    if (!username || !password || !url) {
        throw new Error('WebDAV configuration is incomplete');
    }

    return createClient(url, {
        username,
        password,
    });
}

function createFolder(client: WebDAVClient, path: string) {
    return client.createDirectory(path, { recursive: true });
}

interface UploadOption {
    path: string;
    filename: string;
    data: string;
}

function uploadFile(client: WebDAVClient, { path, filename, data }: UploadOption) {
    return client.putFileContents(`${path}/${filename}`, data);
}

export default {
    connect,
    createFolder,
    uploadFile,
};
