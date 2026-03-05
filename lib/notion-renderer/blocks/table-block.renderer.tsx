import React from 'react';

import {
    TableBlockObjectResponse,
    TableRowBlockObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

import { createBlockRenderer } from '../utils/create-block-renderer';
import { Table, TBody, THead, TD, TH } from '@/components/primitives';
import { Block } from '../types';

function isTableRowBlock(block: Block): block is TableRowBlockObjectResponse {
    return block.type === 'table_row';
}

export default createBlockRenderer<TableBlockObjectResponse>(
    'table',
    async (data, renderer) => {
        if (!renderer.client) {
            return (
                <Table key={`table-${data.id}`}>
                    {await renderer.renderBlock(data.id)}
                </Table>
            );
        }

        const { results } = await renderer.client.blocks.children.list({
            block_id: data.id,
        });
        const rows = results as Block[];

        const hasColumnHeader = data.table?.has_column_header ?? false;
        const hasRowHeader = data.table?.has_row_header ?? false;
        const firstRow = hasColumnHeader && rows.length > 0 ? rows[0] : null;
        const bodyRows =
            hasColumnHeader && rows.length > 0 ? rows.slice(1) : rows;

        const headerRow =
            firstRow && isTableRowBlock(firstRow) ? (
                <THead key={`thead-${data.id}`}>
                    <tr key={`tr-${firstRow.id}`}>
                        {await Promise.all(
                            firstRow.table_row.cells.map(async (cell, idx) => (
                                <TH
                                    key={`th-${idx}-${firstRow.id}-${firstRow.type}`}
                                >
                                    {await renderer.render(...cell)}
                                </TH>
                            )),
                        )}
                    </tr>
                </THead>
            ) : null;

        let bodyRowsContent: React.ReactNode;
        if (hasRowHeader) {
            bodyRowsContent = await Promise.all(
                bodyRows
                    .filter(isTableRowBlock)
                    .map(async row => (
                        <tr key={`tr-${row.id}`}>
                            {await Promise.all(
                                row.table_row.cells.map(async (cell, idx) =>
                                    idx === 0 ? (
                                        <TH key={`th-${idx}-${row.id}`}>
                                            {await renderer.render(...cell)}
                                        </TH>
                                    ) : (
                                        <TD key={`td-${idx}-${row.id}`}>
                                            {await renderer.render(...cell)}
                                        </TD>
                                    ),
                                ),
                            )}
                        </tr>
                    )),
            );
        } else {
            bodyRowsContent = await renderer.render(...bodyRows);
        }

        const bodyContent =
            bodyRows.length > 0 ? (
                <TBody key={`tbody-${data.id}`}>{bodyRowsContent}</TBody>
            ) : null;

        return (
            <Table
                key={`table-${data.id}`}
                additionalClasses={['w-full', 'my-4']}
            >
                {headerRow}
                {bodyContent}
            </Table>
        );
    },
);
