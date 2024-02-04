import React from 'react';

import { TableBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { createBlockRenderer } from '../utils/create-block-renderer';
import { Table } from '@/components/primitives';

export default createBlockRenderer<TableBlockObjectResponse>(
    'table',
    async (data, renderer) => {
        return (
            <Table key={`table-${data.id}`}>
                {await renderer.renderBlock(data.id)}
            </Table>
        );
    },
);
