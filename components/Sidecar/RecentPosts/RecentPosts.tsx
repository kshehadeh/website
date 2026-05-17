import React from 'react';
import { BlogPostFull, getRecentBlogPostTitles } from '@/lib/blog';
import Link from 'next/link';
import { ActiveLink } from '../Sidecar';
import { cacheLife, cacheTag } from 'next/cache';
import { BLOG_CACHE_LIFE } from '@/lib/blog-cache-tags';
import { CollapsibleSidecarCard } from '../CollapsibleSidecarCard';

async function loadRecentPosts() {
    'use cache';
    cacheLife(BLOG_CACHE_LIFE);
    cacheTag('sidecar-recent-posts');
    return getRecentBlogPostTitles(10);
}

export async function RecentPosts({
    currentPost,
}: {
    currentPost?: BlogPostFull;
}) {
    const recentPosts = await loadRecentPosts();

    return (
        <CollapsibleSidecarCard title="Recent Posts">
            <ul className="list-none">
                {recentPosts.map(p => (
                    <li key={p.id} className="leading-8 flex items-start gap-2">
                        <span className="text-muted-foreground mt-1">→</span>
                        {currentPost && p.slug === currentPost?.slug ? (
                            <ActiveLink href={`/blog/posts/${p.slug}`}>
                                {p.title}
                            </ActiveLink>
                        ) : (
                            <Link
                                href={`/blog/posts/${p.slug}`}
                                prefetch={true}
                                className="hover:text-primary transition-colors"
                            >
                                {p.title}
                            </Link>
                        )}
                    </li>
                ))}
            </ul>
        </CollapsibleSidecarCard>
    );
}
