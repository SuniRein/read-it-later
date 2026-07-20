export interface UseTokenCompleteOptions {
  /** Current input text being autocompleted. */
  input: MaybeRef<string>;
  /** Caret position inside `input`; -1 disables completion. */
  cursor: MaybeRef<number>;
  /** Candidate strings offered for completion. */
  candidates: MaybeRef<string[]>;
  /**
   * Characters that terminate a token. Default: `[' ']`.
   * Any of these separates the active token from its neighbours.
   */
  delimiters?: MaybeRef<string[]>;
  /**
   * Optional prefixes a token must start with to be completable, e.g. `['#', '!#']`.
   * Empty (default) means every token is completable.
   */
  prefixes?: MaybeRef<string[]>;
  /** Strip leading whitespace from the token before matching. Default: `false`. */
  trimToken?: MaybeRef<boolean>;
}

const leadingNonWhitespace = /\S/;

export interface ActiveToken {
  /** Start index (inclusive) of the matched token in `input`. */
  start: number;
  /** End index (exclusive) of the matched token in `input`. */
  end: number;
  /** Prefix matched against the token, or `''` when no prefix is required. */
  prefix: string;
  /** Lower-cased token text after the prefix, used for matching candidates. */
  query: string;
}

export interface SelectionResult {
  /** New input text after inserting the completion. */
  value: string;
  /** Caret position to restore after insertion. */
  cursor: number;
}

/**
 * Unified token-based autocompletion logic shared by every consumer of
 * `AutoComplete.vue`. Given an input string and caret, it locates the active
 * token, exposes candidate items filtered against it, and computes the
 * text/caret replacement produced by accepting a completion.
 *
 * The composable is presentation-agnostic. `AutoComplete.vue` wires it to the
 * input element; each caller only declares its delimiters, prefixes and
 * candidate list.
 */
export function useTokenComplete(options: UseTokenCompleteOptions) {
  const activeToken = computed<ActiveToken | null>(() => {
    const text = unref(options.input);
    const cursor = unref(options.cursor);
    if (cursor < 0 || cursor > text.length)
      return null;

    const delimiters = unref(options.delimiters) ?? [' '];

    const start = delimiters.reduce((acc, delim) => {
      const i = text.lastIndexOf(delim, cursor - 1);
      return i === -1 ? acc : Math.max(acc, i + delim.length);
    }, 0);

    const end = delimiters.reduce((acc, delim) => {
      const i = text.indexOf(delim, cursor);
      return i === -1 ? acc : Math.min(acc, i);
    }, text.length);

    let tokenStart = start;
    let token = text.slice(start, end);
    if (unref(options.trimToken) ?? false) {
      const firstNonWs = token.search(leadingNonWhitespace);
      if (firstNonWs === -1) {
        return { start: end, end, prefix: '', query: '' };
      }
      tokenStart = start + firstNonWs;
      token = token.slice(firstNonWs);
    }

    const prefixes = unref(options.prefixes) ?? [];
    const prefix = prefixes.length > 0 ? prefixes.find(p => token.startsWith(p)) ?? '' : '';
    if (prefixes.length > 0 && !prefix)
      return null;

    return {
      start: tokenStart,
      end,
      prefix,
      query: token.slice(prefix.length).toLowerCase(),
    };
  });

  // Pre-normalize candidates once per change of the underlying list — per-keystroke
  // filtering then reuses the lower-cased strings instead of re-allocating them.
  const normalizedCandidates = computed(() =>
    (unref(options.candidates) ?? []).map(value => ({ value, lower: value.toLowerCase() })),
  );

  const items = computed(() => {
    const token = activeToken.value;
    if (!token)
      return [];
    return normalizedCandidates.value
      .filter(c => c.lower.startsWith(token.query))
      .map(c => c.value);
  });

  function select(item: string): SelectionResult {
    const text = unref(options.input);
    const token = activeToken.value;
    if (!token)
      return { value: text, cursor: unref(options.cursor) };

    const before = text.slice(0, token.start);
    const after = text.slice(token.end);
    const inserted = `${token.prefix}${item}`;
    return {
      value: `${before}${inserted}${after}`,
      cursor: before.length + inserted.length,
    };
  }

  return { activeToken, items, select };
}
