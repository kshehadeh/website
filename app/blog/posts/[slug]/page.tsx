import React from 'react';
import { notFound } from 'next/navigation';
import { getBlogPostBySlug } from '@/lib/blog';
import { Post } from '@/components/Post/Post';

export const revalidate = 60 * 60; // 1 hour

export default async function Page({
    params,
}: Readonly<{ params: { slug: string } }>) {    
    const post = await getBlogPostBySlug(decodeURIComponent(params.slug));
    if (!post) {
        notFound();
    } else {
        return <Post post={post} />
    }
}
