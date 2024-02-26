import React, { cache } from 'react';
import { getRecentBlogPosts } from '@/lib/blog';
import { PostList } from '@/components/Post/PostList';
import { H1 } from '@/components/primitives';
import timeouts from '@/lib/timeouts';
import ContentLayout from '@/components/ContentLayout/ContentLayout';
import { Sidecar } from '@/components/Sidecar/Sidecar';

export const revalidate = timeouts.blog;

const getPageData = cache(async () => {
    const posts = await getRecentBlogPosts(12, true);
    return { posts };
});

export default async function MainBlogPage() {
    const { posts } = await getPageData();

    return (
        <ContentLayout pageType={'blog'} sidecar={() => <Sidecar pageType="blog"/>}>
            <H1>All Posts</H1>
            <PostList posts={posts} />
        </ContentLayout>
    );
}
