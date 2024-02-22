import React from 'react';
import { BookmarksList } from '@/components/BookmarksList/BookmarksList';
import { H1 } from '@/components/primitives';
import { getBookmarksByTag } from '@/lib/bookmarks';

export default async function TaggedBookmarkPage({
    params: { tag },
}: {
    params: { tag: string };
}) {
    const bookmarks = await getBookmarksByTag(tag);
    return (
        <>
            <H1>Bookmarks tagged with &quot;{tag}&quot;</H1>
            <BookmarksList bookmarks={bookmarks} />
        </>
    );
}
