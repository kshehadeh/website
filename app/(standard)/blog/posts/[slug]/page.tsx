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
import type { BlogPostFull } from '@/lib/blog';

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

async function getCachedBlogPost(slug: string): Promise<BlogPostFull | undefined> {
    'use cache';
    cacheLife({ stale: 3600, revalidate: 3600 });
    cacheTag(`blog-post-page-${slug}`);
    return getBlogPostBySlug(decodeURIComponent(slug));
}

async function CachedBlogPostContent({ post }: { post: BlogPostFull }) {
    'use cache';
    cacheLife({ stale: 3600, revalidate: 3600 });
    cacheTag(`blog-post-page-${post.slug}`);
    return (
        <ContentLayout
            pageType={'post'}
            sidecar={<Sidecar post={post} pageType={'post'} />}
        >
            <Post post={post} />
        </ContentLayout>
    );
}

export default async function Page(
    props: Readonly<{ params: Promise<{ slug: string }> }>,
) {
    const params = await props.params;
    const post = await getCachedBlogPost(params.slug);
    if (!post) {
        notFound();
    }
    return <CachedBlogPostContent post={post} />;
}
