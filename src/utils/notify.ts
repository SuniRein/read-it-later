import { message } from 'ant-design-vue';

const defaultDuration = 1; // seconds

export default {
    success: (content: string, duration = defaultDuration) => message.success(content, duration),
    error: (content: string, duration = defaultDuration) => message.error(content, duration),
    info: (content: string, duration = defaultDuration) => message.info(content, duration),
};
