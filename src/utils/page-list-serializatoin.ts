import type { PageItem, PageItemIMP } from '@/utils/types';

import { type } from 'arktype';

const SerializedPageItem = type({
  id: 'string',
  info: {
    title: 'string',
    url: 'string',
    '+': 'delete',
  },
  tags: 'string[]',
  desc: 'string = ""', // optional for compatibility
  favorited: 'boolean',
  createdAt: 'string.date.iso',
  updatedAt: 'string.date.iso',
  '+': 'delete',
});

export function serializePageList(pageList: PageItem[]): string {
  return JSON.stringify(pageList);
}

export function deserializePageList(serializedList: string): PageItem[] {
  const raw = JSON.parse(serializedList);
  const parsedList = SerializedPageItem.array()(raw);
  if (parsedList instanceof type.errors) {
    throw new TypeError(`Invalid page list format: ${parsedList.summary}`);
  }
  return parsedList;
}

export function deserializePageListFromIMP(serializedList: string): PageItemIMP[] {
  const SEPARATOR = ';';
  const TAG_SEPARATOR = '|';
  const HEADER = ['url', 'title', 'tags', 'created_at'].join(SEPARATOR);

  const [header, ...lines] = serializedList.split(/\r?\n/).map(l => l.trim()).filter(l => l !== '');
  if (header !== HEADER)
    throw new Error('invalid header');

  return lines
    .map(([line, index]) => {
      const ele = line.split(SEPARATOR);
      if (ele.length !== 4)
        throw new Error(`invalid line format at line ${index + 2}: found ${ele.length} elements, expected 4`);

      const [url, title, tags, createdAt] = ele;
      return {
        url,
        title,
        tags: tags.split(TAG_SEPARATOR).filter(tag => tag.trim() !== ''),
        createdAt: new Date(createdAt),
      };
    })
    .reverse(); // IMP exports by oldest first, we want newest first
}
