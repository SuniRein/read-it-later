import type { FileStat, WebDAVClient } from 'webdav';
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

async function uploadFile(client: WebDAVClient, { path, filename, data }: UploadOption) {
    return await client.putFileContents(`${path}/${filename}`, data);
}

async function listDirectory(client: WebDAVClient, path: string, glob?: string) {
    return (await client.getDirectoryContents(path, { glob })) as FileStat[];
}

async function getFile(client: WebDAVClient, path: string) {
    return (await client.getFileContents(path, { format: 'text' })) as string;
}

export default {
    connect,
    createFolder,
    uploadFile,
    listDirectory,
    getFile,
};
