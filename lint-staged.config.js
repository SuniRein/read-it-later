export default {
  '*.{js,ts,vue}': [() => 'vue-tsc --noEmit', () => 'vitest run --changed'],
  '*.{js,ts,vue,html,css,json,yaml,md}': filenames => filenames.length > 10 ? 'eslint .' : `eslint ${filenames.join(' ')}`,
};
