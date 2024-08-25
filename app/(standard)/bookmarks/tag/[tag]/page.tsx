import React from 'react';
import { BookmarksList } from '@/components/BookmarksList/BookmarksList';
import { getBookmarksByTag } from '@/lib/bookmarks';
import ContentLayout from '@/components/ContentLayout/ContentLayout';
import { Sidecar } from '@/components/Sidecar/Sidecar';

export const maxDuration = 60;

export async function generateMetadata({
    params: { tag },
}: {
    params: { tag: string };
}) {
    return {
        title: `Karim Shehadeh - Bookmarks by Tag "${tag}"`,
        description: `Karim Shehadeh's bookmarks that match tags by the name "${tag}"`,
        alternates: {
            canonical: `/bookmarks/tag/${tag}`,
        },
    };
}

export default async function TaggedBookmarkPage({
    params: { tag },
}: {
    params: { tag: string };
}) {
    const bookmarks = await getBookmarksByTag(tag);
    return (
        <ContentLayout
            pageType={'resume'}
            sidecar={() => <Sidecar pageType="bookmarks" />}
        >
            <h1>Bookmarks tagged with &quot;{tag}&quot;</h1>
            <BookmarksList bookmarks={bookmarks} />
        </ContentLayout>
    );
}
