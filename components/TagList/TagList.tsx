import React from 'react';
import { Tag } from '../Tag/Tag';

export function TagList({
    tags,
    type,
}: {
    tags: string[];
    type: 'blog' | 'bookmarks';
}) {
    return (
        <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
                <Tag key={tag} text={tag} url={`/${type}/tag/${tag}`} />
            ))}
        </div>
    );
}
