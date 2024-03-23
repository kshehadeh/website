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
        <div className="flex gap-2 overflow-x-auto" style={{scrollbarWidth: "none"}}>
            {tags.map(tag => (
                <Tag key={tag} text={tag} url={`/${type}/tag/${tag}`} />
            ))}
        </div>
    );
}
