import React from 'react';

import { ToDoBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { createBlockRenderer } from '../utils/create-block-renderer';
import { LI } from '@/components/primitives';

export default createBlockRenderer<ToDoBlockObjectResponse>(
    'to_do',
    async (data, renderer) => {
        return (
            <LI                
                data-checked="${data.to_do.checked}"
            >
                <input
                    type="checkbox"
                    checked={data.to_do.checked}
                    aria-disabled="true"
                />
                {await renderer.render(...data.to_do.rich_text)}
            </LI>
        );
    },
);
