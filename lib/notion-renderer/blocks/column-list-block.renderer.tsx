import React from 'react';
import { ColumnListBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { createBlockRenderer } from '../utils/create-block-renderer';

export default createBlockRenderer<ColumnListBlockObjectResponse>(
    'column_list',
    async (data, renderer) => {
        if (!renderer.client || !data.has_children) return <></>;

        return (
            <div key={`col-list-${data.id}`} className={`notion-${data.type}`}>
                {await renderer.renderBlock(data.id)}
            </div>
        );
    },
);
