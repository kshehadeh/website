import React from 'react';

import { Heading3BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { createBlockRenderer } from '../utils/create-block-renderer';
import { Details, H3, Summary } from '@/components/primitives';

export default createBlockRenderer<Heading3BlockObjectResponse>(
    'heading_3',
    async (data, renderer) => {
        let result = (
            <H3 key={`h3-${data.id}`}>{await renderer.render(...data.heading_3.rich_text)}</H3>
        );

        if (
            renderer.client &&
            'is_toggleable' in data.heading_3 &&
            data.has_children &&
            data.heading_3.is_toggleable
        ) {
            result = (
                <Details>
                    <Summary>${result}</Summary>$
                    {await renderer.renderBlock(data.id)}
                </Details>
            );
        }

        return result;
    },
);
