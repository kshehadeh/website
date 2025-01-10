import { BlogPostBrief } from '@/lib/blog';
import React from 'react';
import { PostBrief } from './PostBrief';

export default function ThreeUpPosts({
    posts,
    title,
}: {
    posts: BlogPostBrief[];
    title: string;
}) {
    return (
        <div className="flex flex-row">
            <h2
                className="p-2 m-0 text-right border-l  border-gray-900"
                style={{
                    writingMode: 'vertical-rl',
                    transform: 'rotate(180deg)',
                }}
            >
                {title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 gap-4 p-4">
                {posts.map(post => (
                    <div
                        key={`brief-${post.id}`}
                        className="border-y-0 pt-5 md:pt-0"
                    >
                        <PostBrief post={post} hideAuthor={true} />
                    </div>
                ))}
            </div>
        </div>
    );
}
