import { describe, expect, it } from 'vitest';
import { useTokenComplete } from '@/composables/token-complete';

const tags = ['typescript', 'vue', 'rust', 'vim', 'visual'];

describe('useTokenComplete', () => {
  type SetupOverrides = Omit<Partial<Parameters<typeof useTokenComplete>[0]>, 'input' | 'cursor' | 'candidates'>
    & { input?: Ref<string>; cursor?: Ref<number>; candidates?: Ref<string[]> };
  function setup(overrides: SetupOverrides = {}) {
    const input = overrides.input ?? ref('');
    const cursor = overrides.cursor ?? ref(-1);
    const candidates = overrides.candidates ?? ref(tags);
    const { items, select, activeToken } = useTokenComplete({
      input,
      cursor,
      candidates,
      ...overrides,
    });
    return { input, cursor, items, select, activeToken };
  }

  describe('space-delimited with prefixes (SearchBox style)', () => {
    const opts = { delimiters: ref([' ']), prefixes: ref(['#', '!#']) };

    it('matches candidates after the # prefix', () => {
      const { input, items } = setup({ input: ref('#v'), cursor: ref(2), ...opts });
      expect(input.value).toBe('#v');
      expect(items.value.sort()).toEqual(['vim', 'visual', 'vue']);
    });

    it('uses the token under the caret, not the trailing text', () => {
      const { items } = setup({ input: ref('#vue #ru'), cursor: ref(7), ...opts });
      expect(items.value).toEqual(['rust']);
    });

    it('shows all candidates when only the prefix is typed', () => {
      const { items } = setup({ input: ref('#'), cursor: ref(1), ...opts });
      expect(items.value).toHaveLength(tags.length);
    });

    it('does not complete tokens without a prefix', () => {
      const { items } = setup({ input: ref('v'), cursor: ref(1), ...opts });
      expect(items.value).toEqual([]);
    });

    it('select replaces only the active token and reports the caret', () => {
      const select = setup({ input: ref('#ru #v'), cursor: ref(3), ...opts }).select;
      const result = select('rust');
      expect(result.value).toBe('#rust #v');
      expect(result.cursor).toBe('#rust'.length);
    });

    it('select preserves text after the replaced token', () => {
      const select = setup({ input: ref('foo #ru bar'), cursor: ref(7), ...opts }).select;
      expect(select('rust')).toEqual({ value: 'foo #rust bar', cursor: 'foo #rust'.length });
    });
  });

  describe('comma-delimited, trim, no prefix (PageEditSheet style)', () => {
    const opts = { delimiters: ref([',', ' ']), trimToken: ref(true) };

    it('lists every candidate when the last token is empty', () => {
      const { items } = setup({ input: ref('typescript, '), cursor: ref(12), ...opts });
      expect(items.value.sort()).toEqual([...tags].sort());
    });

    it('filters candidates by the last token regardless of leading whitespace', () => {
      const { items } = setup({ input: ref('typescript,   vi'), cursor: ref(16), ...opts });
      expect(items.value.sort()).toEqual(['vim', 'visual']);
    });

    it('select replaces only the trimmed last token', () => {
      const select = setup({ input: ref('typescript, vim'), cursor: ref(14), ...opts }).select;
      const result = select('visual');
      expect(result.value).toBe('typescript, visual');
      expect(result.cursor).toBe(result.value.length);
    });

    it('keeps the leading whitespace when replacing', () => {
      const { select } = setup({ input: ref('typescript,   vi rest'), cursor: ref(16), ...opts });
      // Caret sits on `vi`, the trailing ` rest` is outside the token.
      expect(select('vim').value).toBe('typescript,   vim rest');
    });

    it('completes the first token when the caret is on it', () => {
      const { items } = setup({ input: ref('vu'), cursor: ref(2), ...opts });
      expect(items.value.sort()).toEqual(['vue']);
    });
  });

  describe('activeToken', () => {
    it('is null when cursor is out of range', () => {
      const { activeToken } = setup({ input: ref('x'), cursor: ref(5) });
      expect(activeToken.value).toBeNull();
    });

    it('reports the prefix and bounds of the active token', () => {
      const { activeToken } = setup({
        input: ref('foo #ru bar'),
        cursor: ref(7),
        delimiters: ref([' ']),
        prefixes: ref(['#']),
      });
      expect(activeToken.value).toEqual({ start: 4, end: 7, prefix: '#', query: 'ru' });
    });
  });
});
