import React from 'react';
import { getBlogTags } from '@/lib/blog';
import { PostList } from '@/components/Post/PostList';
import { Sidecar } from '@/components/Sidecar/Sidecar';
import ContentLayout from '@/components/ContentLayout/ContentLayout';
import { HeadingWithRotatedBg } from '@/components/HeadingWithRotatedBg';
import { loadCachedBlogPostsByTag } from './blog-tag-data';

export async function generateStaticParams(): Promise<Array<{ tag: string }>> {
    const tags = await getBlogTags();
    return tags.map(tag => ({ tag }));
}

export async function generateMetadata(props: {
    params: Promise<{ tag: string }>;
}) {
    const { tag } = await props.params;

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

async function TaggedBlogContent({ tag }: { tag: string }) {
    const posts = await loadCachedBlogPostsByTag(tag);
    return (
        <>
            <HeadingWithRotatedBg>{tag}</HeadingWithRotatedBg>
            <PostList
                posts={posts}
                hideAbstract={true}
                hideAuthor={true}
                hideTags={true}
            />
        </>
    );
}

export default async function PostsByTagPage(props: {
    params: Promise<{ tag: string }>;
}) {
    const { tag } = await props.params;

    return (
        <ContentLayout pageType={'tags'} sidecar={<Sidecar pageType="tags" />}>
            <TaggedBlogContent tag={tag} />
        </ContentLayout>
    );
}
