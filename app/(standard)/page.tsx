import React, { cache } from 'react';
import ThreeUpPosts from '@/components/Post/ThreeUpPosts';
import { getRecentBlogPosts } from '@/lib/blog';
import { H1 } from '@/components/primitives';
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
            <H1>Recent Posts</H1>
            <ThreeUpPosts posts={posts} />
            <H1>Some Projects</H1>
            <p>Coming soon...</p>
        </>
    );
}
