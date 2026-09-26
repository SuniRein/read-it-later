export interface CloudFile {
  id: string;
  name: string;
  size: number;
}

export interface GetFileOptions {
  noCache?: boolean;
}

export interface CloudService {
  list: () => Promise<CloudFile[]>;
  get: (id: string, options?: GetFileOptions) => Promise<string>;
  remove: (id: string) => Promise<void>;
  save: (name: string, data: string) => Promise<void>;
  validate: () => Promise<void>;
  preflight: () => Promise<boolean>;

  findSyncFile: () => Promise<CloudFile | null>;
  saveSyncFile: (data: string) => Promise<void>;
}

export interface CloudStorageEmit {
  (e: 'loadData', data: string): void;
  (e: 'saveLocally', data: string, name: string): void;
}
