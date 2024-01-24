import React from 'react';
import { notFound } from 'next/navigation';
import { getBlogPostBySlug } from '@/lib/blog';

export default async function Page({
    params,
}: Readonly<{ params: { slug: string } }>) {
    const post = await getBlogPostBySlug(params.slug);
    if (!post) notFound();
    return (
        <>
            <h1>{post.title}</h1>
            <p>{post.date}</p>
            <div
                dangerouslySetInnerHTML={{ __html: post.contentAsRenderedHtml }}
            ></div>
        </>
    );
}
