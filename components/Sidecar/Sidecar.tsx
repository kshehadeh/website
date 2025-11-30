import React from 'react';
import { BlogPostFull, getBlogPostHeadings } from '@/lib/blog';
import Link from 'next/link';
import { TableOfContents } from '../Post/TableOfContents';
import styles from './Sidecar.module.css';
import { OtherThings } from './OtherThings/OtherThings';
import { RecentPosts } from './RecentPosts/RecentPosts';
import { PageType } from '@/lib/page';
import { RecentBookmarks } from './RecentBookmarks/RecentBookmarks';

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
        <Link
            href={href}
            className={`${className ?? ''}`}
        >
            {children}
        </Link>
    );
}

export async function Sidecar({
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
            headings.unshift({ level: 1, text: post.title, children: [] });
            contextComponents.push(
                <TableOfContents key="table-of-contents" headings={headings} />,
            );
        }
    }

    return (
        <div className={styles.sidecar}>
            {contextComponents}
            {includeRecent && <RecentPosts currentPost={post} />}
            {includeBookarks && <RecentBookmarks />}
            <OtherThings pageType={pageType} />
        </div>
    );
}
