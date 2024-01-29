import { BlogPostBrief } from '@/lib/blog';
import React from 'react';
import { PostBrief } from './PostBrief';

export default function ThreeUpPosts({ posts }: { posts: BlogPostBrief[] }) {
    return (
        <div className="bg-white py-12 sm:py-12">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:mx-0">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        From the blog
                    </h2>
                </div>
                <div className="mx-auto mt-5 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {posts.map(post => (
                        <PostBrief key={`brief-${post.id}`} post={post} hideAuthor={true} />
                    ))}
                </div>
            </div>
        </div>
    );
}
