import React, { cache } from 'react';
import { getRecentBlogPosts } from '@/lib/blog';
import ContentLayout from '@/components/ContentLayout/ContentLayout';
import { Metadata } from 'next';
import { PostList } from '@/components/Post/PostList';
import { PostHero } from '@/components/Post/PostHero';
import { cacheLife, cacheTag } from 'next/cache';

export async function generateMetadata(): Promise<Metadata> {
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
    cacheLife({ stale: 3600, revalidate: 3600 });
    cacheTag('home-page');
    const { recent } = await getPageData();
    const [heroPost, ...gridPosts] = recent;
    
    return (
        <ContentLayout
            pageType={'home'}
            sidecar={() => null}
        >
            {heroPost && <PostHero post={heroPost} />}
            {gridPosts.length > 0 && <PostList posts={gridPosts} />}
        </ContentLayout>
    );
}
