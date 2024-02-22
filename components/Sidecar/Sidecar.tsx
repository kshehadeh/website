import React from 'react';
import { getRecentBlogPosts } from '@/lib/blog';
import Link from 'next/link';

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
            className={`${className ?? ''} text-blue-600 hover:text-purple-60 after:content-['_←']` }
        >
            {children}
        </Link>
    );
}

export async function Sidecar({
    currentPostSlug,
}: {
    currentPostSlug: string;
}) {
    const recentPosts = await getRecentBlogPosts(10, false);

    return (
        <aside className="ml-3">
            <h2 className="text-2xl font-bold mb-4">Recent Posts</h2>
            <ul className="list-none">
                {recentPosts.map(post => (
                    <li key={post.id} className="leading-8">
                        {post.slug === currentPostSlug ? (
                            <ActiveLink href={`/blog/posts/${post.slug}`}>
                                {post.title}
                            </ActiveLink>
                        ) : (
                            <Link href={`/blog/posts/${post.slug}`}>
                                {post.title}
                            </Link>
                        )}
                    </li>
                ))}
            </ul>

            <h2 className="text-2xl font-bold mb-4">Other Things</h2>
            <ul className="list-none">
                <li className="leading-8">
                    {'resume' === currentPostSlug ? <ActiveLink href="/resume">My Resume</ActiveLink> : <Link href="/resume">My Resume</Link>}
                </li>
                <li className="leading-8">
                    {'about' === currentPostSlug ? <ActiveLink href="/about">About Me</ActiveLink> : <Link href="/about">About Me</Link>}
                </li>
            </ul>            
        </aside>
    );
}
