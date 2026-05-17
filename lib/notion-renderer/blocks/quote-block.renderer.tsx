import React from 'react';

import { QuoteBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { createBlockRenderer } from '../utils/create-block-renderer';
import { Blockquote } from '@/components/primitives';
import { tailWindClassesFromQuoteColor } from '@/lib/class-builder';

export default createBlockRenderer<QuoteBlockObjectResponse>(
    'quote',
    async (data, renderer) => {
        return (
            <Blockquote
                key={`blockquote-${data.id}`}
                additionalClasses={tailWindClassesFromQuoteColor(
                    data.quote.color,
                )}
            >
                {await renderer.render(...data.quote.rich_text)}
            </Blockquote>
        );
    },
);
