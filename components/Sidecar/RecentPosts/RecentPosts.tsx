import React from 'react';
import { BlogPostFull, getRecentBlogPosts } from '@/lib/blog';
import Link from 'next/link';
import { ActiveLink } from '../Sidecar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { HeadingWithRotatedBg } from '@/components/HeadingWithRotatedBg';

export async function RecentPosts({
    currentPost,
}: {
    currentPost?: BlogPostFull;
}) {
    const recentPosts = await getRecentBlogPosts(10, false);

    return (
        <Card className="mb-4">
            <CardHeader>
                <HeadingWithRotatedBg
                    as="h2"
                    className="text-base font-semibold font-mono"
                >
                    Recent Posts
                </HeadingWithRotatedBg>
            </CardHeader>
            <CardContent>
                <ul className="list-none">
                    {recentPosts.map(p => (
                        <li
                            key={p.id}
                            className="leading-8 flex items-start gap-2"
                        >
                            <span className="text-muted-foreground mt-1">
                                →
                            </span>
                            {currentPost && p.slug === currentPost?.slug ? (
                                <ActiveLink href={`/blog/posts/${p.slug}`}>
                                    {p.title}
                                </ActiveLink>
                            ) : (
                                <Link
                                    href={`/blog/posts/${p.slug}`}
                                    className="hover:text-primary transition-colors"
                                >
                                    {p.title}
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
