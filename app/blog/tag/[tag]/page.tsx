import React from 'react';
import { getBlogPostsByTag } from '@/lib/blog';
import { PostList } from '@/components/Post/PostList';
import { H1 } from '@/components/primitives';

export const revalidate = 60 * 60; // 1 hour

export default async function PostsByTagPage({params: { tag }}: { params: { tag: string } }) {
    // Get the list the last X posts from Notion
    const posts = await getBlogPostsByTag(tag)
    return (
        <>
            <H1>{tag}</H1>
            <PostList posts={posts} hideAbstract={true} hideAuthor={true} hideTags={true} />
        </>
    );
}
