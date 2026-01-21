import type { ExternalToast } from 'vue-sonner';
import { toast } from 'vue-sonner';

const defaultDuration = 1000;

function makeNotifyFunction(type: 'success' | 'error' | 'warning' | 'info', duration = defaultDuration) {
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
