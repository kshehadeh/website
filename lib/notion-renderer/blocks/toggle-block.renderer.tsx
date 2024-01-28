import React from 'react';

import { ToggleBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { createBlockRenderer } from '../utils/create-block-renderer';
import { Details, Summary } from '@/components/primitives';

export default createBlockRenderer<ToggleBlockObjectResponse>(
    'toggle',
    async (data, renderer) => {
        if (!renderer.client) return <></>;

        return (
            <Details>
                <Summary>
                    {await renderer.render(...data.toggle.rich_text)}
                </Summary>
                {data.has_children ? await renderer.renderBlock(data.id) : ''}
            </Details>
        );
    },
);
