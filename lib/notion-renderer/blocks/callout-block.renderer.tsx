import React from 'react';
import { CalloutBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { createBlockRenderer } from '../utils/create-block-renderer';
import { Blockquote } from '@/components/primitives';

export default createBlockRenderer<CalloutBlockObjectResponse>(
    'callout',
    async (data, renderer) => {
        return (
            <Blockquote key={`bq-${data.id}`}>
                <div className="icon">
                    {data.callout.icon &&
                        (await renderer.render(data.callout.icon))}
                </div>
                <div className="content">
                    {await renderer.render(...data.callout.rich_text)}
                </div>
            </Blockquote>
        );
    },
);
