import { BlogPostBrief } from '@/lib/blog';
import React from 'react';
import { PostBrief } from './PostBrief';

export default function ThreeUpPosts({ posts }: { posts: BlogPostBrief[] }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y divide-gray-400 gap-4">
            {posts.map(post => (
                <div key={`brief-${post.id}`} className="border-y-0 pt-5 md:pt-0">
                    <PostBrief post={post} hideAuthor={true} />
                </div>
            ))}
        </div>
    );
}
