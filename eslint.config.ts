import antfu from '@antfu/eslint-config';

export default antfu({
    stylistic: {
        indent: 4,
        semi: true,
        quotes: 'single',
    },
    formatters: {
        css: 'prettier',
        html: 'prettier',
        markdown: 'prettier',
    },
    yaml: {
        overrides: {
            'yaml/indent': 2,
        },
    },
    rules: {
        'style/quote-props': ['error', 'as-needed'],
    },
});
