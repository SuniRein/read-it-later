import antfu from '@antfu/eslint-config';

export default antfu(
    {
        formatters: true,
        stylistic: {
            indent: 4,
            semi: true,
            quotes: 'single',
        },
        yaml: {
            overrides: {
                'yaml/indent': 2,
            },
        },
        vue: true,
        typescript: {
            filesTypeAware: ['**/*.{ts,tsx,vue}'],
            tsconfigPath: 'tsconfig.json',
        },
        rules: {
            'style/quote-props': ['error', 'as-needed'],
        },
    },
    {
        files: ['**/*.{ts,tsx,vue}'],
        rules: {
            'ts/strict-boolean-expressions': ['error', { allowNullableString: true }],
            'ts/no-misused-promises': 'off',
            'ts/no-unsafe-argument': 'off',
            'ts/no-unsafe-assignment': 'off',
            'ts/no-unsafe-call': 'off',
            'ts/no-unsafe-member-access': 'off',
        },
    },
);
