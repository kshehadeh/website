import React, { cache } from 'react';
import { notFound } from 'next/navigation';
import { getBlogPostBySlug } from '@/lib/blog';
import { Post } from '@/components/Post/Post';

export const revalidate = 60 * 60; // 1 hour

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
        return <Post post={post} />;
    }
}

export const generateStaticParams = async () => {
    return [];
};
