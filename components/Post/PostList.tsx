import { BlogPostBrief } from '@/lib/blog';
import React from 'react';
import { PostBrief, PostBriefViewOptions } from './PostBrief';

export function PostListItem({
    post,
    ...rest
}: React.PropsWithChildren<{ post: BlogPostBrief } & PostBriefViewOptions>) {
    return (
        <li className="basis-full md:basis-[calc(33.333%-0.5rem)] min-w-[280px]">
            <PostBrief post={post} {...rest} hideAuthor={true} />
        </li>
    );
}

export function PostList({
    posts,
    ...rest
}: React.PropsWithChildren<{ posts: BlogPostBrief[] } & PostBriefViewOptions>) {
    return (
        <ul className="list-none flex flex-wrap gap-2 gap-y-10 px-6 md:px-8">
            {posts.map(post => (
                <PostListItem key={`post-${post.id}`} post={post} {...rest} />
            ))}
        </ul>
    );
}
