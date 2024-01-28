import React from 'react';
import { BlogPostBrief } from '@/lib/blog';

export default function PostTime({ post }: { post: BlogPostBrief }) {
    return (
        <time dateTime={post.date} className="text-gray-500">
            {post.date}
        </time>
    );
}
