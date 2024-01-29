import React from 'react';
import { BlogPostBrief } from '@/lib/blog';
import { DateTime } from 'luxon';

export default function PostTime({ post }: { post: BlogPostBrief }) {
    return (
        <time dateTime={post.date} className="text-gray-500">
            {DateTime.fromFormat(post.date, 'yyyy-MM-dd').toFormat('MMM d, yyyy')}
        </time>
    );
}
