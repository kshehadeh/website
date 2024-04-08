import React, { cache } from 'react';
import { getBlogPostsByTag } from '@/lib/blog';
import { PostList } from '@/components/Post/PostList';
import timeouts from '@/lib/timeouts';
import { Sidecar } from '@/components/Sidecar/Sidecar';
import ContentLayout from '@/components/ContentLayout/ContentLayout';

export const revalidate = timeouts.blog;

const getPageData = cache(async (tag: string) => {
    const posts = await getBlogPostsByTag([tag]);
    return { posts };
});

export async function generateMetadata({
    params: { tag },
}: {
    params: { tag: string };
}) {
    return {
        title: `Karim Shehadeh - Posts by Tag "${tag}"`,
        description: `Karim Shehadeh's blog posts that match tags by the name "${tag}"`,
        alternates: {
            canonical: `/blog/posts/tag/${tag}`,
            types: {
                'application/rss+xml': 'https://www.karim.cloud/api/rss.xml',
            },
        },
    };
}

export default async function PostsByTagPage({
    params: { tag },
}: {
    params: { tag: string };
}) {
    const { posts } = await getPageData(tag);
    return (
        <ContentLayout
            pageType={'tags'}
            sidecar={() => <Sidecar pageType="tags" />}
        >
            <h1>{tag}</h1>
            <PostList
                posts={posts}
                hideAbstract={true}
                hideAuthor={true}
                hideTags={true}
            />
        </ContentLayout>
    );
}

export const generateStaticParams = async () => {
    return [];
};
