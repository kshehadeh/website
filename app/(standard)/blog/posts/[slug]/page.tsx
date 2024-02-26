import React, { cache } from 'react';
import { notFound } from 'next/navigation';
import { getBlogPostBySlug } from '@/lib/blog';
import { Post } from '@/components/Post/Post';
import timeouts from '@/lib/timeouts';
import ContentLayout from '@/components/ContentLayout/ContentLayout';
import { Sidecar } from '@/components/Sidecar/Sidecar';

export const revalidate = timeouts.blog;

const getPageData = cache(async (slug: string) => {
    const post = await getBlogPostBySlug(decodeURIComponent(slug));
    return { post };
});

export default async function Page({
    params,
}: Readonly<{ params: { slug: string } }>) {
    const { post } = await getPageData(params.slug);
    if (!post) {
        notFound();
    } else {
        return (
            <ContentLayout
                pageType={'post'}
                sidecar={() => <Sidecar post={post} pageType={'post'} />}
            >
                <Post post={post} />
            </ContentLayout>
        );
    }
}

export const generateStaticParams = async () => {
    return [];
};
