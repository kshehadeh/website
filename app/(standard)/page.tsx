import React, { cache } from 'react';
import ThreeUpPosts from '@/components/Post/ThreeUpPosts';
import { getRecentBlogPosts } from '@/lib/blog';
import timeouts from '@/lib/timeouts';
import ContentLayout from '@/components/ContentLayout/ContentLayout';
import { Sidecar } from '@/components/Sidecar/Sidecar';

export const revalidate = timeouts.home;

export async function generateMetadata() {
    return {
        alternates: {
            canonical: '/',
        },
    };
}

const getPageData = cache(async () => {
    const posts = await getRecentBlogPosts(3, true);
    return { posts };
});

export default async function Home() {
    const { posts } = await getPageData();
    return (
        <ContentLayout
            pageType={'home'}
            sidecar={() => <Sidecar pageType="home" />}
        >
            <ThreeUpPosts posts={posts} />
        </ContentLayout>
    );
}
