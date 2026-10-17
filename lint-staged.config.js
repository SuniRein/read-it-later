export default {
  '*.{js,ts,vue}': [() => 'vue-tsc --noEmit', () => 'vitest run --changed'],
  '*.vue': filenames => `node scripts/check-vue-tags.mjs ${filenames.join(' ')}`,
  '*.{js,mjs,ts,vue,html,css,json,yaml,md}': filenames => filenames.length > 10 ? 'eslint .' : `eslint ${filenames.join(' ')}`,
};
