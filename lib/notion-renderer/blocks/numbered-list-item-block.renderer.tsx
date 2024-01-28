import React from 'react';

import { NumberedListItemBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { createBlockRenderer } from '../utils/create-block-renderer';
import { LI } from '@/components/primitives';

export default createBlockRenderer<NumberedListItemBlockObjectResponse>(
    'numbered_list_item',
    async (data, renderer) => {
        return (
            <LI key={`li-${data.id}`}>
                {await renderer.render(...data.numbered_list_item.rich_text)}
            </LI>
        );
    },
);
