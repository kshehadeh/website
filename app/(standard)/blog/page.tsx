import React, { cache } from 'react';
import { getRecentBlogPosts } from '@/lib/blog';
import { PostList } from '@/components/Post/PostList';
import ContentLayout from '@/components/ContentLayout/ContentLayout';
import { Sidecar } from '@/components/Sidecar/Sidecar';
import { HeadingWithRotatedBg } from '@/components/HeadingWithRotatedBg';
import { cacheLife, cacheTag } from 'next/cache';

export async function generateMetadata() {
    'use cache';
    cacheLife({ stale: 3600, revalidate: 3600 });
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

const getPageData = cache(async () => {
    const posts = await getRecentBlogPosts(12, true);
    return { posts };
});

export default async function MainBlogPage() {
    'use cache';
    cacheLife({ stale: 3600, revalidate: 3600 });
    cacheTag('blog-page');

    const { posts } = await getPageData();

    return (
        <ContentLayout
            pageType={'blog'}
            sidecar={() => <Sidecar pageType="blog" />}
        >
            <HeadingWithRotatedBg>Blog</HeadingWithRotatedBg>
            <PostList posts={posts} />
        </ContentLayout>
    );
}
