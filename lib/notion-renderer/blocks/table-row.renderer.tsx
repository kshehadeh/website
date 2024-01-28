import React from 'react';

import { TableRowBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { createBlockRenderer } from '../utils/create-block-renderer';
import { TD, TR } from '@/components/primitives';

export default createBlockRenderer<TableRowBlockObjectResponse>(
    'table_row',
    async (data, renderer) => {
        return (
            <TR key={`tr-${data.id}`}>
                {(
                    await Promise.all(
                        data.table_row.cells.map(async (cell, idx) => (
                            <TD key={`td-${idx}-${data.id}-${data.type}`}>
                                {await renderer.render(...cell)}
                            </TD>
                        )),
                    )
                ).join('')}
            </TR>
        );
    },
);
