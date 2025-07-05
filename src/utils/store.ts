import { storage } from '#imports';

import type { PageItem } from '@/utils/types';

export default {
    pageList: storage.defineItem<PageItem[]>('local:pageList'),
};
