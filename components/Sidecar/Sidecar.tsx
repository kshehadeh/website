import React, { Suspense } from 'react';
import { BlogPostFull, getBlogPostHeadings } from '@/lib/blog';
import Link from 'next/link';
import { TableOfContents } from '../Post/TableOfContents';
import styles from './Sidecar.module.css';
import { OtherThings } from './OtherThings/OtherThings';
import { RecentPosts } from './RecentPosts/RecentPosts';
import { PageType } from '@/lib/page';
import { RecentBookmarks } from './RecentBookmarks/RecentBookmarks';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { HeadingWithRotatedBg } from '@/components/HeadingWithRotatedBg';

export function ActiveLink({
    children,
    href,
    className,
}: {
    children: React.ReactNode;
    href: string;
    className?: string;
}) {
    return (
        <Link href={href} className={`${className ?? ''}`}>
            {children}
        </Link>
    );
}

function SidecarCardFallback({ title }: { title: string }) {
    return (
        <Card className="mb-4">
            <CardHeader>
                <HeadingWithRotatedBg
                    as="h2"
                    className="text-base font-semibold font-mono"
                >
                    {title}
                </HeadingWithRotatedBg>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <div className="h-4 rounded bg-muted animate-pulse" />
                    <div className="h-4 rounded bg-muted animate-pulse" />
                    <div className="h-4 rounded bg-muted animate-pulse" />
                </div>
            </CardContent>
        </Card>
    );
}

export function Sidecar({
    post,
    pageType,
    includeRecent,
    includeBookarks,
}: {
    pageType: PageType;
    post?: BlogPostFull;
    includeRecent?: boolean;
    includeBookarks?: boolean;
}) {
    const contextComponents: React.ReactNode[] = [];
    includeRecent = includeRecent ?? true;
    includeBookarks = includeBookarks ?? true;

    if (pageType === 'post' && post) {
        const headings = getBlogPostHeadings(post);
        if (headings.length > 0) {
            headings.unshift({
                id: `post-title-${post.id}`,
                level: 1,
                text: post.title,
                children: [],
            });
            contextComponents.push(
                <TableOfContents key="table-of-contents" headings={headings} />,
            );
        }
    }

    return (
        <div className={styles.sidecar}>
            {contextComponents}
            {includeRecent && (
                <Suspense
                    fallback={<SidecarCardFallback title="Recent Posts" />}
                >
                    <RecentPosts currentPost={post} />
                </Suspense>
            )}
            {includeBookarks && (
                <Suspense
                    fallback={<SidecarCardFallback title="Around The Web" />}
                >
                    <RecentBookmarks />
                </Suspense>
            )}
            <OtherThings pageType={pageType} />
        </div>
    );
}
