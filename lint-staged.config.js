export default {
    '*.{js,ts,vue,json,html,css,yaml}': ['prettier --check'],
    '*.{js,ts,vue}': [() => 'vue-tsc --noEmit', () => 'vitest run --changed'],
};
