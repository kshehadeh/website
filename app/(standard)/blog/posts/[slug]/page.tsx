import React, { cache } from 'react';
import { notFound } from 'next/navigation';
import { getBlogPostBySlug } from '@/lib/blog';
import { Post } from '@/components/Post/Post';
import ContentLayout from '@/components/ContentLayout/ContentLayout';
import { Sidecar } from '@/components/Sidecar/Sidecar';
import { Metadata } from 'next';
import { cacheLife, cacheTag } from 'next/cache';

const getPageData = cache(async (slug: string) => {
    const post = await getBlogPostBySlug(decodeURIComponent(slug));
    return { post };
});

export async function generateMetadata(
    props: Readonly<{ params: Promise<{ slug: string }> }>,
): Promise<Metadata> {
    'use cache';
    const params = await props.params;
    cacheLife({ stale: 3600, revalidate: 3600 });
    cacheTag(`blog-post-page-${params.slug}`);
    
    const { post } = await getPageData(params.slug);
    return {
        title: `Karim Shehadeh - ${post?.title}`,
        description: `${post?.abstract}`,
        openGraph: {
            title: `Karim Shehadeh - ${post?.title}`,
            description: `${post?.abstract}`,
            images: post?.coverUrl,
        },
        alternates: {
            canonical: `/blog/posts/${params.slug}`,
            types: {
                'application/rss+xml': 'https://www.karim.cloud/api/rss.xml',
            },
        },
    };
}

export default async function Page(
    props: Readonly<{ params: Promise<{ slug: string }> }>,
) {
    const params = await props.params;
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
