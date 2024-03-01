import { BlogPostBrief } from '@/lib/blog';
import React from 'react';
import { PostBrief } from './PostBrief';
import { H2 } from '../primitives';

export default function ThreeUpPosts({ posts, title }: { posts: BlogPostBrief[], title: string }) {
    return (
        <div className="flex flex-col gap-3">
            <H2>{title}</H2>
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y divide-gray-400 md:divide-y-0 gap-4">            
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
