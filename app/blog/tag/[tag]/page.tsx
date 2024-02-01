import React, { cache } from 'react';
import { getBlogPostsByTag } from '@/lib/blog';
import { PostList } from '@/components/Post/PostList';
import { H1 } from '@/components/primitives';

export const revalidate = 60 * 60; // 1 hour

const getPageData = cache(async (tag: string) => {
    const posts = await getBlogPostsByTag(tag);
    return { posts };
})

export default async function PostsByTagPage({params: { tag }}: { params: { tag: string } }) {
    const { posts } = await getPageData(tag);
    return (
        <>
            <H1>{tag}</H1>
            <PostList posts={posts} hideAbstract={true} hideAuthor={true} hideTags={true} />
        </>
    );
}
