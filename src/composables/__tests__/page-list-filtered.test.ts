import type { FavoritedFilterOption } from '@/utils/types';

import { describe, expect, it } from 'vitest';

import { usePageListFiltered } from '@/composables/page-list-filtered';

const mockPages = [
    {
        info: { title: 'Vue Guide', url: 'https://vuejs.org' },
        tags: ['frontend', 'javascript'],
        favorited: true,
    },
    {
        info: { title: 'React Handbook Guide', url: 'https://reactjs.org' },
        tags: ['frontend', 'react'],
        favorited: false,
    },
    {
        info: { title: 'Node.js Docs', url: 'https://nodejs.org' },
        tags: ['backend', 'javascript'],
        favorited: true,
    },
].map(item => ({
    ...item,
    id: item.info.title,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
}));

describe('filtered by search text', () => {
    function filterBySearchText(searchText: string) {
        return usePageListFiltered(mockPages, 'all', searchText);
    }

    describe('by title', () => {
        it('title start with', () => {
            const result = filterBySearchText('Vue');
            expect(result.value.length).toBe(1);
            expect(result.value[0].info.title).toBe('Vue Guide');
        });

        it('title contains', () => {
            const result = filterBySearchText('Guide');
            expect(result.value.length).toBe(2);
            expect(result.value[0].info.title).toBe('Vue Guide');
            expect(result.value[1].info.title).toBe('React Handbook Guide');
        });
    });

    describe('by tags', () => {
        it('single tag totally matched', () => {
            const result = filterBySearchText('#frontend');
            expect(result.value.length).toBe(2);
            expect(result.value[0].info.title).toBe('Vue Guide');
            expect(result.value[1].info.title).toBe('React Handbook Guide');
        });

        it('single tag partially matched', () => {
            const result = filterBySearchText('#front');
            expect(result.value.length).toBe(0);
        });

        it('multiple tags totally matched', () => {
            const result = filterBySearchText('#frontend #javascript');
            expect(result.value.length).toBe(1);
            expect(result.value[0].info.title).toBe('Vue Guide');
        });

        it('multiple tags partially matched', () => {
            const result = filterBySearchText('#javascript #java');
            expect(result.value.length).toBe(0);
        });
    });

    it('returns all pages when search text is empty', () => {
        const result = filterBySearchText('');
        expect(result.value.length).toBe(3);
    });

    it('by both title and tags', () => {
        const result = filterBySearchText('Guide #javascript');
        expect(result.value.length).toBe(1);
        expect(result.value[0].info.title).toBe('Vue Guide');
    });
});

describe('filtered by favorited', () => {
    function filterByFavorited(favorited: FavoritedFilterOption) {
        return usePageListFiltered(mockPages, favorited, '');
    }

    it('returns all pages when favorited is "all"', () => {
        const result = filterByFavorited('all');
        expect(result.value.length).toBe(3);
    });

    it('returns favorited pages', () => {
        const result = filterByFavorited('favorited');
        expect(result.value.length).toBe(2);
        expect(result.value.every(p => p.favorited)).toBe(true);
    });

    it('returns not favorited pages', () => {
        const result = filterByFavorited('unfavorited');
        expect(result.value.length).toBe(1);
        expect(result.value[0].favorited).toBe(false);
    });
});

it('combines favorited and search filters', () => {
    const result = usePageListFiltered(mockPages, 'favorited', '#frontend');
    expect(result.value.length).toBe(1);
    expect(result.value[0].info.title).toBe('Vue Guide');
});
