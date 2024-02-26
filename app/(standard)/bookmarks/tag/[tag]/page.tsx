import React from 'react';
import { BookmarksList } from '@/components/BookmarksList/BookmarksList';
import { H1 } from '@/components/primitives';
import { getBookmarksByTag } from '@/lib/bookmarks';
import ContentLayout from '@/components/ContentLayout/ContentLayout';
import { Sidecar } from '@/components/Sidecar/Sidecar';

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
            <H1>Bookmarks tagged with &quot;{tag}&quot;</H1>
            <BookmarksList bookmarks={bookmarks} />
        </ContentLayout>
    );
}
