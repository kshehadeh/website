import React from 'react';
import { notFound } from 'next/navigation';
import { Post } from '@/components/Post/Post';
import ContentLayout from '@/components/ContentLayout/ContentLayout';
import { Sidecar } from '@/components/Sidecar/Sidecar';
import { Metadata } from 'next';
import { cacheLife, cacheTag } from 'next/cache';
import { getRecentBlogPosts, type BlogPostFull } from '@/lib/blog';
import {
    blogPostMetadataTag,
    blogPostPageTag,
    loadCachedBlogPostBySlug,
} from './blog-post-data';

const PREBUILT_POST_COUNT = 20;

function normalizeSlug(slug: string): string {
    return decodeURIComponent(slug);
}

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
    const posts = await getRecentBlogPosts(PREBUILT_POST_COUNT, false);
    return posts
        .map(post => post.slug)
        .filter(Boolean)
        .map(slug => ({ slug }));
}

export async function generateMetadata(
    props: Readonly<{ params: Promise<{ slug: string }> }>,
): Promise<Metadata> {
    'use cache';
    const params = await props.params;
    const normalizedSlug = normalizeSlug(params.slug);
    cacheLife({ stale: 3600, revalidate: 3600 });
    cacheTag(blogPostMetadataTag(normalizedSlug));

    const post = await loadCachedBlogPostBySlug(params.slug);
    return {
        title: `Karim Shehadeh - ${post?.title}`,
        description: `${post?.abstract}`,
        openGraph: {
            title: `Karim Shehadeh - ${post?.title}`,
            description: `${post?.abstract}`,
            images: post?.coverUrl,
        },
        alternates: {
            canonical: `/blog/posts/${params.slug}`,
            types: {
                'application/rss+xml': 'https://www.karim.cloud/api/rss.xml',
            },
        },
    };
}

async function CachedBlogPostContent({ post }: { post: BlogPostFull }) {
    'use cache';
    cacheLife({ stale: 3600, revalidate: 3600 });
    cacheTag(blogPostPageTag(post.slug));
    return (
        <ContentLayout
            pageType={'post'}
            sidecar={<Sidecar post={post} pageType={'post'} />}
        >
            <Post post={post} />
        </ContentLayout>
    );
}

export default async function Page(
    props: Readonly<{ params: Promise<{ slug: string }> }>,
) {
    'use cache';
    const params = await props.params;
    const normalizedSlug = normalizeSlug(params.slug);
    cacheLife({ stale: 3600, revalidate: 3600 });
    cacheTag(blogPostPageTag(normalizedSlug));

    const post = await loadCachedBlogPostBySlug(params.slug);
    if (!post) {
        notFound();
    }
    return <CachedBlogPostContent post={post} />;
}
