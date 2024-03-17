import React from 'react';
import { getRecentBookmarks } from '@/lib/bookmarks';
import { BookmarksList } from '@/components/BookmarksList/BookmarksList';
import timeouts from '@/lib/timeouts';
import { Sidecar } from '@/components/Sidecar/Sidecar';
import ContentLayout from '@/components/ContentLayout/ContentLayout';

export const revalidate = timeouts.bookmarks;

export async function generateMetadata() {
    return {
        title: `Karim Shehadeh - Handy Links to Tools, Articles, and More`,
        description: `Karim Shehadeh's bookmarks which have been collected over time and might be useful to others.`,
        alternates: {
            canonical: `/bookmarks`,
        },
    };
}

export default async function BookmarksPage() {
    const bookmarks = await getRecentBookmarks(12);
    return (
        <ContentLayout
            pageType={'bookmarks'}
            sidecar={() => <Sidecar pageType="bookmarks" />}
        >
            <h1>Bookmarks</h1>
            <BookmarksList bookmarks={bookmarks} />
        </ContentLayout>
    );
}
