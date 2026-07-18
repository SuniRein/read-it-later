import type { ExternalToast } from 'vue-sonner';
import { toast } from 'vue-sonner';

const defaultDuration = 1000;

export type NotifyLevel = 'success' | 'error' | 'warning' | 'info';

function makeNotifyFunction(type: NotifyLevel, duration = defaultDuration) {
  return (message: string, data?: ExternalToast) => {
    toast[type](message, {
      duration,
      ...data,
    });
  };
}

export default {
  success: makeNotifyFunction('success'),
  error: makeNotifyFunction('error'),
  warning: makeNotifyFunction('warning'),
  info: makeNotifyFunction('info'),
};
