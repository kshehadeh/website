import React from 'react';
import { getRecentBlogPosts } from '@/lib/blog';
import { PostList } from '@/components/Post/PostList';
import ContentLayout from '@/components/ContentLayout/ContentLayout';
import { Sidecar } from '@/components/Sidecar/Sidecar';
import { HeadingWithRotatedBg } from '@/components/HeadingWithRotatedBg';
import { cacheLife, cacheTag } from 'next/cache';
import { BLOG_CACHE_LIFE } from '@/lib/blog-cache-tags';

export async function generateMetadata() {
    'use cache';
    cacheLife(BLOG_CACHE_LIFE);
    cacheTag('blog-page-metadata');

    return {
        title: `Karim Shehadeh - Blog`,
        description: `Karim Shehadeh's blog posts about web development, engineering management and more.`,
        alternates: {
            canonical: `/blog`,
            types: {
                'application/rss+xml': 'https://www.karim.cloud/api/rss.xml',
            },
        },
    };
}

export default async function MainBlogPage() {
    'use cache';
    cacheLife(BLOG_CACHE_LIFE);
    cacheTag('blog-page');

    const posts = await getRecentBlogPosts(12, true);

    return (
        <ContentLayout pageType={'blog'} sidecar={<Sidecar pageType="blog" />}>
            <HeadingWithRotatedBg>Blog</HeadingWithRotatedBg>
            <PostList posts={posts} />
        </ContentLayout>
    );
}
