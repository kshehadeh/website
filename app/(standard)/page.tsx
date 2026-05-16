import React, { cache } from 'react';
import { getRecentBlogPosts } from '@/lib/blog';
import ContentLayout from '@/components/ContentLayout/ContentLayout';
import { Metadata } from 'next';
import { PostList } from '@/components/Post/PostList';
import { PostHero } from '@/components/Post/PostHero';
import { cacheLife, cacheTag } from 'next/cache';
import { BLOG_CACHE_LIFE } from '@/lib/blog-cache-tags';

export async function generateMetadata(): Promise<Metadata> {
    'use cache';
    cacheLife(BLOG_CACHE_LIFE);
    cacheTag('home-page-metadata');

    return {
        alternates: {
            canonical: '/',
            types: {
                'application/rss+xml': 'https://www.karim.cloud/api/rss.xml',
            },
        },
    };
}

const getPageData = cache(async () => {
    const recent = await getRecentBlogPosts(5, true);
    return { recent };
});

export default async function Home() {
    'use cache';
    cacheLife(BLOG_CACHE_LIFE);
    cacheTag('home-page');
    const { recent } = await getPageData();
    const [heroPost, ...gridPosts] = recent;

    return (
        <ContentLayout pageType={'home'} sidecar={null}>
            {heroPost && <PostHero post={heroPost} />}
            {gridPosts.length > 0 && <PostList posts={gridPosts} />}
        </ContentLayout>
    );
}
