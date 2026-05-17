import React from 'react';
import { notFound } from 'next/navigation';
import { Post } from '@/components/Post/Post';
import { Metadata } from 'next';
import { getRecentBlogPostSlugs } from '@/lib/blog';
import {
    loadCachedBlogPostBySlug,
    loadCachedBlogPostMetadataBySlug,
} from './blog-post-data';

const PREBUILT_POST_COUNT = 20;

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
    const slugs = await getRecentBlogPostSlugs(PREBUILT_POST_COUNT);
    return slugs.map(slug => ({ slug }));
}

export async function generateMetadata(
    props: Readonly<{ params: Promise<{ slug: string }> }>,
): Promise<Metadata> {
    const { slug } = await props.params;
    const post = await loadCachedBlogPostMetadataBySlug(slug);
    return {
        title: `Karim Shehadeh - ${post?.title}`,
        description: `${post?.abstract ?? ''}`,
        openGraph: {
            title: `Karim Shehadeh - ${post?.title}`,
            description: `${post?.abstract ?? ''}`,
            images: post?.coverUrl,
        },
        alternates: {
            canonical: `/blog/posts/${slug}`,
            types: {
                'application/rss+xml': 'https://www.karim.cloud/api/rss.xml',
            },
        },
    };
}

export default async function Page(
    props: Readonly<{ params: Promise<{ slug: string }> }>,
) {
    const { slug } = await props.params;
    const post = await loadCachedBlogPostBySlug(slug);
    if (!post) {
        notFound();
    }

    return <Post post={post} />;
}
