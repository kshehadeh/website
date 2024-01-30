import React from 'react';
import { BlogPostBrief } from '@/lib/blog';
import { formatDate } from '@/lib/util';

export default function PostTime({ post }: { post: BlogPostBrief }) {
    return (
        <time dateTime={post.date} className="text-gray-500">
            {formatDate(post.date)}
        </time>
    );
}
