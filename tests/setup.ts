import { config } from '@vue/test-utils';

config.global.plugins.push(i18n);

// happy-dom has no LockManager; install a minimal exclusive FIFO one.
const lockQueues = new Map<string, Promise<unknown>>();
const locks = {
  request: async (name: string, task: () => Promise<unknown>) => {
    const prev = lockQueues.get(name) ?? Promise.resolve();
    const result = prev.then(task);
    lockQueues.set(name, result.catch(() => {}));
    return result;
  },
};
Object.defineProperty(navigator, 'locks', { value: locks, configurable: true });
