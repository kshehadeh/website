import { BlogPostBrief } from '@/lib/blog';
import React from 'react';

export function PostList ({ children }: React.PropsWithChildren) {
    return (
        <ul className="post-list">
            {children}
        </ul>
    );
}

export function Post ({ post }: { post: BlogPostBrief }) {
    return (
        <li>
            <h2>{post.title}</h2>
            <p>{post.abstract}</p>
            <p>{post.date}</p>
        </li>
    );
}
    