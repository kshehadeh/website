import React, { cache } from 'react';
import { getRecentBlogPosts } from '@/lib/blog';
import { PostList } from '@/components/Post/PostList';
import { H1 } from '@/components/primitives';

export const revalidate = 60 * 60; // 1 hour

const getPageData = cache(async () => {
    const posts = await getRecentBlogPosts(12, true);
    return { posts };
});

export default async function MainBlogPage() {
    const { posts } = await getPageData();

    return (
        <>
            <H1>All Posts</H1>
            <PostList posts={posts} />
        </>
    );
}
