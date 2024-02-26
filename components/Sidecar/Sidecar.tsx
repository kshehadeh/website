import React from 'react';
import {  BlogPostFull, getBlogPostHeadings } from '@/lib/blog';
import Link from 'next/link';
import { TableOfContents } from '../Post/TableOfContents';
import styles from './Sidecar.module.css';
import { OtherThings } from './OtherThings/OtherThings';
import { RecentPosts } from './RecentPosts/RecentPosts';
import { PageType } from '@/lib/page';

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
            className={`${className ?? ''}  before:content-['→_']`}
        >
            {children}
        </Link>
    );
}

export async function Sidecar({
    post,
    pageType
}: {
    pageType: PageType;
    post?: BlogPostFull;
}) {
    const contextComponents: React.ReactNode[] = [];

    if (pageType === 'post' && post) {
        const headings = getBlogPostHeadings(post);
        contextComponents.push(<TableOfContents headings={headings} />)
    }

    return (
        <div className={styles.sidecar}>
            {contextComponents}            
            <RecentPosts currentPost={post} />
            <OtherThings pageType={pageType} />

        </div>
    );
}
