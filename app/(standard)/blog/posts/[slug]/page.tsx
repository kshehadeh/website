import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Post } from '@/components/Post/Post';
import ContentLayout from '@/components/ContentLayout/ContentLayout';
import { Sidecar } from '@/components/Sidecar/Sidecar';
import { Metadata } from 'next';
import { getRecentBlogPostSlugs } from '@/lib/blog';
import { loadCachedBlogPostBySlug } from './blog-post-data';

const PREBUILT_POST_COUNT = 20;

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
    const slugs = await getRecentBlogPostSlugs(PREBUILT_POST_COUNT);
    return slugs.map(slug => ({ slug }));
}

export async function generateMetadata(
    props: Readonly<{ params: Promise<{ slug: string }> }>,
): Promise<Metadata> {
    const { slug } = await props.params;
    const post = await loadCachedBlogPostBySlug(slug);
    return {
        title: `Karim Shehadeh - ${post?.title}`,
        description: `${post?.abstract ?? ''}`,
        openGraph: {
            title: `Karim Shehadeh - ${post?.title}`,
            description: `${post?.abstract ?? ''}`,
            images: post?.coverUrl,
        },
        alternates: {
            canonical: `/blog/posts/${slug}`,
            types: {
                'application/rss+xml': 'https://www.karim.cloud/api/rss.xml',
            },
        },
    };
}

function PostSidecarFallback() {
    return (
        <div className="space-y-4 animate-pulse">
            <div className="rounded-xl border border-border bg-card p-6">
                <div className="h-8 w-40 rounded bg-muted mb-6" />
                <div className="space-y-4">
                    <div className="h-4 w-3/4 rounded bg-muted" />
                    <div className="h-4 w-2/3 rounded bg-muted" />
                    <div className="h-4 w-4/5 rounded bg-muted" />
                </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
                <div className="h-8 w-32 rounded bg-muted mb-6" />
                <div className="space-y-4">
                    <div className="h-4 w-4/5 rounded bg-muted" />
                    <div className="h-4 w-3/5 rounded bg-muted" />
                    <div className="h-4 w-2/3 rounded bg-muted" />
                </div>
            </div>
        </div>
    );
}

async function BlogPostContent({ slug }: { slug: string }) {
    const post = await loadCachedBlogPostBySlug(slug);
    if (!post) {
        notFound();
    }

    return <Post post={post} />;
}

async function BlogPostSidecar({ slug }: { slug: string }) {
    const post = await loadCachedBlogPostBySlug(slug);
    if (!post) {
        return null;
    }

    return <Sidecar post={post} pageType={'post'} />;
}

export default async function Page(
    props: Readonly<{ params: Promise<{ slug: string }> }>,
) {
    const { slug } = await props.params;

    return (
        <ContentLayout
            pageType={'post'}
            sidecar={
                <Suspense fallback={<PostSidecarFallback />}>
                    <BlogPostSidecar slug={slug} />
                </Suspense>
            }
        >
            <BlogPostContent slug={slug} />
        </ContentLayout>
    );
}
