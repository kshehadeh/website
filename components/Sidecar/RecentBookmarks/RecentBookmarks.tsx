import React from 'react';
import Link from 'next/link';
import { getRecentBookmarks } from '@/lib/bookmarks';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { HeadingWithRotatedBg } from '@/components/HeadingWithRotatedBg';
import { cacheLife, cacheTag } from 'next/cache';
import { BLOG_CACHE_LIFE } from '@/lib/blog-cache-tags';

async function loadRecentBookmarks() {
    'use cache';
    cacheLife(BLOG_CACHE_LIFE);
    cacheTag('sidecar-recent-bookmarks');
    return getRecentBookmarks(10);
}

export async function RecentBookmarks() {
    const recentBookmarks = await loadRecentBookmarks();

    return (
        <Card className="mb-4">
            <CardHeader>
                <HeadingWithRotatedBg
                    as="h2"
                    className="text-base font-semibold font-mono"
                >
                    Around The Web
                </HeadingWithRotatedBg>
            </CardHeader>
            <CardContent>
                <ul className="list-none">
                    {recentBookmarks.map(p => (
                        <li
                            key={p.id}
                            className="leading-8 flex items-start gap-2"
                        >
                            <span className="text-muted-foreground mt-1">
                                →
                            </span>
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
            </CardContent>
        </Card>
    );
}
