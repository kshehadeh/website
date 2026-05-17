import React, { Suspense } from 'react';
import ContentLayout from '@/components/ContentLayout/ContentLayout';
import { Sidecar } from '@/components/Sidecar/Sidecar';
import { BlogPostFull } from '@/lib/blog';
import { loadCachedBlogPostBySlug } from './[slug]/blog-post-data';

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

async function BlogPostSidecar({ post }: { post?: BlogPostFull }) {
    return <Sidecar post={post} pageType={'post'} />;
}

export default async function BlogPostsLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ slug?: string }>;
}>) {
    const { slug } = await params;
    const post = slug ? await loadCachedBlogPostBySlug(slug) : undefined;

    return (
        <ContentLayout
            pageType={'post'}
            sidecar={
                <Suspense fallback={<PostSidecarFallback />}>
                    <BlogPostSidecar post={post} />
                </Suspense>
            }
        >
            {children}
        </ContentLayout>
    );
}
