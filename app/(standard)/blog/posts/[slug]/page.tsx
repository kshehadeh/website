import React from 'react';
import { notFound } from 'next/navigation';
import { Post } from '@/components/Post/Post';
import ContentLayout from '@/components/ContentLayout/ContentLayout';
import { Sidecar } from '@/components/Sidecar/Sidecar';
import { Metadata } from 'next';
import { cacheLife, cacheTag } from 'next/cache';
import { getRecentBlogPosts } from '@/lib/blog';
import { BLOG_CACHE_LIFE } from '@/lib/blog-cache-tags';
import { blogPostPageTag, loadCachedBlogPostBySlug } from './blog-post-data';

const PREBUILT_POST_COUNT = 1;

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
    const params = await props.params;
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

async function renderPostBySlug(slug: string) {
    'use cache';
    cacheLife(BLOG_CACHE_LIFE);
    cacheTag(blogPostPageTag(slug));
    const post = await loadCachedBlogPostBySlug(slug);
    if (!post) {
        return null;
    }

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
    const params = await props.params;
    // #region agent log
    console.info(
        JSON.stringify({
            sessionId: 'f75588',
            runId: 'baseline',
            hypothesisId: 'H2',
            location: 'app/(standard)/blog/posts/[slug]/page.tsx:68',
            message: 'Page request received',
            data: { slug: params.slug },
        }),
    );
    // #endregion
    const renderedPost = await renderPostBySlug(params.slug);
    // #region agent log
    console.info(
        JSON.stringify({
            sessionId: 'f75588',
            runId: 'baseline',
            hypothesisId: 'H2',
            location: 'app/(standard)/blog/posts/[slug]/page.tsx:72',
            message: 'Page renderPostBySlug resolved',
            data: { slug: params.slug, wasNull: renderedPost === null },
        }),
    );
    // #endregion
    if (!renderedPost) {
        notFound();
    }
    return renderedPost;
}
