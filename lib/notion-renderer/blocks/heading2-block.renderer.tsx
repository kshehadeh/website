import React from 'react';

import { Heading2BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { createBlockRenderer } from '../utils/create-block-renderer';
import { Details, H2, Summary } from '@/components/primitives';

export default createBlockRenderer<Heading2BlockObjectResponse>(
    'heading_2',
    async (data, renderer) => {
        let result = (
            <H2 key={`h2-${data.id}`}>{await renderer.render(...data.heading_2.rich_text)}</H2>
        );

        if (
            renderer.client &&
            'is_toggleable' in data.heading_2 &&
            data.has_children &&
            data.heading_2.is_toggleable
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
