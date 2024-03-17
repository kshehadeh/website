import React from 'react';

import { Heading3BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { createBlockRenderer } from '../utils/create-block-renderer';
import { Details, Summary } from '@/components/primitives';
import {
    getAnchorIdFromHeading,
    getPlainTextFromRichTextResponse,
} from '@/lib/blog';

export default createBlockRenderer<Heading3BlockObjectResponse>(
    'heading_3',
    async (data, renderer) => {
        let result = (
            <h3 key={`h3-${data.id}`}>
                <a
                    id={getAnchorIdFromHeading(
                        getPlainTextFromRichTextResponse(
                            data.heading_3.rich_text,
                        ),
                    )}
                ></a>
                {await renderer.render(...data.heading_3.rich_text)}
            </h3>
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
