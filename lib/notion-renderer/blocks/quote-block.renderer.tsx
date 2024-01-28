import React from 'react';

import { QuoteBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { createBlockRenderer } from '../utils/create-block-renderer';
import { Blockquote } from '@/components/primitives';

export default createBlockRenderer<QuoteBlockObjectResponse>(
    'quote',
    async (data, renderer) => {
        return (
            <Blockquote>
                {await renderer.render(...data.quote.rich_text)}
            </Blockquote>
        );
    },
);
