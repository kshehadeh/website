import React from 'react';
import ThreeUpPosts from '@/components/Post/ThreeUpPosts';
import { getRecentBlogPosts } from '@/lib/blog';

export default async function Home() {
    const posts = await getRecentBlogPosts(3, true);
    return (
        <ThreeUpPosts posts={posts} />
    );
}
