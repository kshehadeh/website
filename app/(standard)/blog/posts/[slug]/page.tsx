import React from 'react';
import { notFound } from 'next/navigation';
import { getBlogPostBySlug, getBlogPosts } from '@/lib/blog';
import { Post } from '@/components/Post/Post';
import ContentLayout from '@/components/ContentLayout/ContentLayout';
import { Sidecar } from '@/components/Sidecar/Sidecar';
import { Metadata } from 'next';
import { cacheLife, cacheTag } from 'next/cache';
import { isRichTextProperty } from '@/lib/notion';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

export async function generateStaticParams() {
    const posts = await getBlogPosts({
        status: 'Published',
        sortBy: {
            property: 'Posted',
            direction: 'descending',
        },
    });

    return posts
        .filter((post): post is PageObjectResponse => !!post)
        .map(post => {
            const slug = isRichTextProperty(post.properties.Slug)
                ? post.properties.Slug.rich_text[0].plain_text
                : '';
            return { slug };
        });
}

export async function generateMetadata(
    props: Readonly<{ params: Promise<{ slug: string }> }>,
): Promise<Metadata> {
    'use cache';
    const params = await props.params;
    cacheLife({ stale: 3600, revalidate: 3600 });
    cacheTag(`blog-post-metdata-${params.slug}`);

    const post = await getBlogPostBySlug(decodeURIComponent(params.slug));
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
    'use cache';
    const params = await props.params;
    cacheLife({ stale: 3600, revalidate: 3600 });
    cacheTag(`blog-post-page-${params.slug}`);

    const post = await getBlogPostBySlug(decodeURIComponent(params.slug));
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
