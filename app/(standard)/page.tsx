import React, { cache } from 'react';
import ThreeUpPosts from '@/components/Post/ThreeUpPosts';
import { getRecentBlogPosts } from '@/lib/blog';
import timeouts from '@/lib/timeouts';

export const revalidate = timeouts.home;

const getPageData = cache(async () => {
    const posts = await getRecentBlogPosts(3, true);
    return { posts };
});

export default async function Home() {
    const { posts } = await getPageData();
    return (
        <>
            <ThreeUpPosts posts={posts} />
        </>
    );
}
