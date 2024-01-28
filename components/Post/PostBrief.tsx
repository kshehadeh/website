import { BlogPostBrief } from '@/lib/blog';
import React from 'react';

export function PostList ({ children }: React.PropsWithChildren) {
    return (
        <ul className="post-list">
            {children}
        </ul>
    );
}

export function PostBrief ({ post }: { post: BlogPostBrief }) {
    return (
        <li>
            <h1>{post.title}</h1>
            <p>{post.abstract}</p>
            <p>{post.date}</p>
        </li>
    );
}
    