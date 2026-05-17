import React, { Suspense } from 'react';
import { BookmarksList } from '@/components/BookmarksList/BookmarksList';
import { getBookmarkTags, getBookmarksByTag } from '@/lib/bookmarks';
import ContentLayout from '@/components/ContentLayout/ContentLayout';
import { Sidecar } from '@/components/Sidecar/Sidecar';
import { cacheLife, cacheTag } from 'next/cache';

export const maxDuration = 60;

export async function generateStaticParams(): Promise<Array<{ tag: string }>> {
    const tags = await getBookmarkTags();
    return tags.map(tag => ({ tag }));
}

export async function generateMetadata(props: {
    params: Promise<{ tag: string }>;
}) {
    const { tag } = await props.params;

    return {
        title: `Karim Shehadeh - Bookmarks by Tag "${tag}"`,
        description: `Karim Shehadeh's bookmarks that match tags by the name "${tag}"`,
        alternates: {
            canonical: `/bookmarks/tag/${tag}`,
        },
    };
}

function TaggedBookmarksFallback() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="h-10 w-72 rounded bg-muted" />
            {Array.from({ length: 6 }).map((_, index) => (
                <div
                    key={index}
                    className="rounded-xl border border-border bg-card p-6 space-y-4"
                >
                    <div className="h-6 w-2/3 rounded bg-muted" />
                    <div className="h-4 w-full rounded bg-muted" />
                    <div className="h-4 w-4/5 rounded bg-muted" />
                </div>
            ))}
        </div>
    );
}

async function TaggedBookmarksContent({ tag }: { tag: string }) {
    'use cache';
    cacheLife({ stale: 3600, revalidate: 3600 });
    cacheTag(`bookmarks-tag-page-${tag}`);

    const bookmarks = await getBookmarksByTag(tag);
    return (
        <>
            <h1>Bookmarks tagged with &quot;{tag}&quot;</h1>
            <BookmarksList bookmarks={bookmarks} />
        </>
    );
}

export default async function TaggedBookmarkPage(props: {
    params: Promise<{ tag: string }>;
}) {
    const { tag } = await props.params;

    return (
        <ContentLayout
            pageType={'resume'}
            sidecar={<Sidecar pageType="bookmarks" />}
        >
            <Suspense fallback={<TaggedBookmarksFallback />}>
                <TaggedBookmarksContent tag={tag} />
            </Suspense>
        </ContentLayout>
    );
}
