import React from 'react';
import { getRecentBookmarks } from '@/lib/bookmarks';
import { BookmarksList } from '@/components/BookmarksList/BookmarksList';
import { Sidecar } from '@/components/Sidecar/Sidecar';
import ContentLayout from '@/components/ContentLayout/ContentLayout';
import { HeadingWithRotatedBg } from '@/components/HeadingWithRotatedBg';
import { cacheLife, cacheTag } from 'next/cache';

export async function generateMetadata() {
    'use cache';
    cacheLife({ stale: 3600, revalidate: 3600 });
    cacheTag('bookmarks-page-metadata');

    return {
        title: `Karim Shehadeh - Handy Links to Tools, Articles, and More`,
        description: `Karim Shehadeh's bookmarks which have been collected over time and might be useful to others.`,
        alternates: {
            canonical: `/bookmarks`,
        },
    };
}

export default async function BookmarksPage() {
    'use cache';
    cacheLife({ stale: 3600, revalidate: 3600 });
    cacheTag('bookmarks-page');

    const bookmarks = await getRecentBookmarks(12);
    return (
        <ContentLayout
            pageType={'bookmarks'}
            sidecar={() => <Sidecar pageType="bookmarks" />}
        >
            <HeadingWithRotatedBg>Bookmarks</HeadingWithRotatedBg>
            <BookmarksList bookmarks={bookmarks} />
        </ContentLayout>
    );
}
