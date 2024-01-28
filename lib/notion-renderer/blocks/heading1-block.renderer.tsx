import React from 'react';

import { Heading1BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { createBlockRenderer } from '../utils/create-block-renderer';
import { Details, H1, Summary } from '@/components/primitives';

export default createBlockRenderer<Heading1BlockObjectResponse>(
    'heading_1',
    async (data, renderer) => {
        let result = (
            <H1>{await renderer.render(...data.heading_1.rich_text)}</H1>
        );

        if (
            renderer.client &&
            'is_toggleable' in data.heading_1 &&
            data.has_children &&
            data.heading_1.is_toggleable
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
