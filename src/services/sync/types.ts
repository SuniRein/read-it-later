import type { PageItem } from '@/common/types';

export interface SyncAddOp { t: 'add'; item: PageItem }
export interface SyncRemoveOp { t: 'remove'; id: string }
export interface SyncUpdateOp {
  t: 'update';
  id: string;
  patch: {
    title?: string;
    tags?: string[];
    desc?: string;
    url?: string;
    favorited?: boolean;
    updatedAt: string;
  };
}
export interface SyncMoveOp { t: 'moveToTop'; id: string }

export type SyncOp = SyncAddOp | SyncRemoveOp | SyncUpdateOp | SyncMoveOp;

export type SyncLogCallback = (op: SyncOp | SyncOp[]) => void;
