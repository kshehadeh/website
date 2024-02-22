import React from 'react';
import { getRecentBookmarks } from '@/lib/bookmarks';
import { H1 } from '@/components/primitives';
import { BookmarksList } from '@/components/BookmarksList/BookmarksList';
import timeouts from '@/lib/timeouts';

export const revalidate = timeouts.bookmarks;

export default async function BookmarksPage() {
    const bookmarks = await getRecentBookmarks(12);
    return (
        <>
            <H1>Bookmarks</H1>
            <BookmarksList bookmarks={bookmarks} />
        </>
    );
}
