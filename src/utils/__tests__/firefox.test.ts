import { expect, it } from 'vitest';

import { urlRestricted } from '../firefox';

it('checks restricted URLs', () => {
  expect(urlRestricted('about:blank')).toBe(true);
  expect(urlRestricted('chrome://settings')).toBe(true);
  expect(urlRestricted('data:text/plain,Hello%20World')).toBe(true);
  expect(urlRestricted('file:///path/to/file.txt')).toBe(true);
  expect(urlRestricted('javascript:alert("Hello")')).toBe(true);
  expect(urlRestricted('https://example.com')).toBe(false);
  expect(urlRestricted('http://example.com')).toBe(false);
});
