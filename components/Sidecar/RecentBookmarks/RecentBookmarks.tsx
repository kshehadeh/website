import React from 'react';
import Link from 'next/link';
import { getRecentBookmarkLinks } from '@/lib/bookmarks';
import { cacheLife, cacheTag } from 'next/cache';
import { BLOG_CACHE_LIFE } from '@/lib/blog-cache-tags';
import { CollapsibleSidecarCard } from '../CollapsibleSidecarCard';

async function loadRecentBookmarks() {
    'use cache';
    cacheLife(BLOG_CACHE_LIFE);
    cacheTag('sidecar-recent-bookmarks');
    return getRecentBookmarkLinks(10);
}

export async function RecentBookmarks() {
    const recentBookmarks = await loadRecentBookmarks();

    return (
        <CollapsibleSidecarCard title="Around The Web">
            <ul className="list-none">
                {recentBookmarks.map(p => (
                    <li key={p.id} className="leading-8 flex items-start gap-2">
                        <span className="text-muted-foreground mt-1">→</span>
                        <Link
                            href={`${p.url}`}
                            target="_blank"
                            className="hover:text-primary transition-colors"
                        >
                            {p.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </CollapsibleSidecarCard>
    );
}
