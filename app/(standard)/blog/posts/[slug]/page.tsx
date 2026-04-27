import React from 'react';
import { notFound } from 'next/navigation';
import { getBlogPostBySlug } from '@/lib/blog';
import { Post } from '@/components/Post/Post';
import ContentLayout from '@/components/ContentLayout/ContentLayout';
import { Sidecar } from '@/components/Sidecar/Sidecar';
import { Metadata } from 'next';
import { cacheLife, cacheTag } from 'next/cache';
import type { BlogPostFull } from '@/lib/blog';

function normalizeSlug(slug: string): string {
    return decodeURIComponent(slug);
}

function blogPostPageTag(slug: string): string {
    return `blog-post-page-${normalizeSlug(slug)}`;
}

function blogPostMetadataTag(slug: string): string {
    return `blog-post-metadata-${normalizeSlug(slug)}`;
}

export async function generateMetadata(
    props: Readonly<{ params: Promise<{ slug: string }> }>,
): Promise<Metadata> {
    'use cache';
    const params = await props.params;
    const normalizedSlug = normalizeSlug(params.slug);
    cacheLife({ stale: 3600, revalidate: 3600 });
    cacheTag(blogPostMetadataTag(normalizedSlug));

    const post = await getBlogPostBySlug(normalizedSlug);
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

async function getCachedBlogPost(
    slug: string,
): Promise<BlogPostFull | undefined> {
    'use cache';
    cacheLife({ stale: 3600, revalidate: 3600 });
    cacheTag(blogPostPageTag(slug));
    return getBlogPostBySlug(normalizeSlug(slug));
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
    cacheLife({ stale: 3600, revalidate: 3600 });
    cacheTag(blogPostPageTag(params.slug));
    const post = await getCachedBlogPost(params.slug);
    if (!post) {
        notFound();
    }
    return <CachedBlogPostContent post={post} />;
}
