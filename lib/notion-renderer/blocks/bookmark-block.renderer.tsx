import React from 'react';
import { BookmarkBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { createBlockRenderer } from '../utils/create-block-renderer';
import { A } from '@/components/primitives';

export default createBlockRenderer<BookmarkBlockObjectResponse>(
    'bookmark',
    async data => {
        return (
            <A
                key={`bookmark-${data.id}`}
                href={data.bookmark.url}
                target="_blank"                
            >
                {data.bookmark.url}
            </A>
        );
    },
);
