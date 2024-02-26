import React, { cache } from 'react';
import { getRecentBlogPosts } from '@/lib/blog';
import { PostList } from '@/components/Post/PostList';
import timeouts from '@/lib/timeouts';
import ContentLayout from '@/components/ContentLayout/ContentLayout';
import { Sidecar } from '@/components/Sidecar/Sidecar';

export const revalidate = timeouts.blog;

export async function generateMetadata() {
    return {
        title: `Karim Shehadeh - Blog`,
        description: `Karim Shehadeh's blog posts about web development, engineering management and more.`,
        alternates: {
            canonical: `/blog`,
        },
    };
}

const getPageData = cache(async () => {
    const posts = await getRecentBlogPosts(12, true);
    return { posts };
});

export default async function MainBlogPage() {
    const { posts } = await getPageData();

    return (
        <ContentLayout
            pageType={'blog'}
            sidecar={() => <Sidecar pageType="blog" />}
        >
            <PostList posts={posts} />
        </ContentLayout>
    );
}
