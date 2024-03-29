import React from 'react';

import { NumberedListItemBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { createBlockRenderer } from '../utils/create-block-renderer';
import { LI } from '@/components/primitives';
import { fetchPageBlocks } from '@/lib/notion';

export default createBlockRenderer<NumberedListItemBlockObjectResponse>(
    'numbered_list_item',
    async (data, renderer) => {
        let children = null;
        if (data.has_children) {
            children = await fetchPageBlocks(data.id);
        }

        return (
            <LI key={`li-${data.id}`}>
                {await renderer.render(...data.numbered_list_item.rich_text)}
                {children && (await renderer.render(...children))}
            </LI>
        );
    },
);
