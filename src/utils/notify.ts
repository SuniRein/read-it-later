import { message } from 'ant-design-vue';

const defaultDuration = 1; // seconds

function makeNotifyFunction(fn: typeof message.success) {
    return (content: string, duration = defaultDuration) => fn({
        content,
        duration,
        style: {
            whiteSpace: 'pre-line',
        },
    });
}

export default {
    success: makeNotifyFunction(message.success.bind(message)),
    error: makeNotifyFunction(message.error.bind(message)),
    info: makeNotifyFunction(message.info.bind(message)),
};
