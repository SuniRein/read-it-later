import antfu from '@antfu/eslint-config';
import betterTailwindcss from 'eslint-plugin-better-tailwindcss';

export default antfu(
  {
    formatters: true,
    stylistic: {
      semi: true,
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
  {
    plugins: {
      'better-tailwindcss': betterTailwindcss,
    },
    rules: {
      ...betterTailwindcss.configs.recommended.rules,
      'better-tailwindcss/enforce-consistent-line-wrapping': ['warn', { printWidth: 120 }],
    },
    settings: {
      'better-tailwindcss': {
        entryPoint: 'src/style.css',
      },
    },
  },
);
