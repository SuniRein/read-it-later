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

export default {
    connect,
};
