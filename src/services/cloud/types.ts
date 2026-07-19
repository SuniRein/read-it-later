export interface CloudFile {
  id: string;
  name: string;
  size: number;
}

export interface CloudService {
  list: () => Promise<CloudFile[]>;
  get: (id: string) => Promise<string>;
  remove: (id: string) => Promise<void>;
  save: (name: string, data: string) => Promise<void>;
  validate: () => Promise<void>;
  preflight: () => Promise<boolean>;
}

export interface CloudStorageEmit {
  (e: 'loadData', data: string): void;
  (e: 'saveLocally', data: string, name: string): void;
}
