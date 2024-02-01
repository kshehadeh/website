import React from 'react';
import { getRecentBlogPosts } from '@/lib/blog';
import { PostList } from '@/components/Post/PostList';
import { H1 } from '@/components/primitives';

export const revalidate = 60 * 60; // 1 hour

export default async function MainBlogPage() {
    // Get the list the last X posts from Notion
    const posts = await getRecentBlogPosts(12, true);
    return (
        <>
            <H1>All Posts</H1>
            <PostList posts={posts} />
        </>
    );
}
