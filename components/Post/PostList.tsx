import { BlogPostBrief } from '@/lib/blog';
import React from 'react';
import { PostBrief, PostBriefViewOptions } from './PostBrief';

export function PostListItem({
    post,
    ...rest
}: React.PropsWithChildren<{ post: BlogPostBrief } & PostBriefViewOptions>) {
    return (
        <li className="basis-[24%]">
            <PostBrief post={post} {...rest} hideAuthor={true} />
        </li>
    );
}

export function PostList({
    posts,
    ...rest
}: React.PropsWithChildren<{ posts: BlogPostBrief[] } & PostBriefViewOptions>) {
    return (
        <ul className="list-none grid grid-cols-1 md:grid-cols-3 gap-2 gap-y-10 px-6 md:px-8">
            {posts.map(post => (
                <PostListItem key={`post-${post.id}`} post={post} {...rest} />
            ))}
        </ul>
    );
}
