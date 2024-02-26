import React from 'react';
import { BlogPostFull, getRecentBlogPosts } from '@/lib/blog';
import Link from 'next/link';
import { ActiveLink } from '../Sidecar';

export async function RecentPosts({
    currentPost,
}: {
    currentPost?: BlogPostFull;
}) {
    const recentPosts = await getRecentBlogPosts(10, false);

    return (
        <aside>
            <h2>Recent Posts</h2>
            <ul>
                {recentPosts.map(p => (
                    <li key={p.id} className="leading-8">
                        {currentPost && p.slug === currentPost?.slug ? (
                            <ActiveLink href={`/blog/posts/${p.slug}`}>
                                {p.title}
                            </ActiveLink>
                        ) : (
                            <Link href={`/blog/posts/${p.slug}`}>
                                {p.title}
                            </Link>
                        )}
                    </li>
                ))}
            </ul>
        </aside>
    );
}
