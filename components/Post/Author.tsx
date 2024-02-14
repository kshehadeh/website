import React from 'react';
import { BlogPostBrief } from '@/lib/blog';

export function Author({ post }: { post: BlogPostBrief }) {
    if (!post.author) return null;

    return (
        <div className="relative mt-8 flex items-center gap-x-4">
            <img
                src={post.author.image}
                alt=""
                className="h-10 w-10 rounded-full bg-gray-50"
            />
            <div className="text-sm leading-6">
                <p className="font-semibold text-gray-900">
                    <a href={post.author.href}>
                        <span className="absolute inset-0" />
                        {post.author.name}
                    </a>
                </p>
                <p className="text-gray-600">{post.author.role}</p>
            </div>
        </div>
    );
}
