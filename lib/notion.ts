import 'server-only';

import { Client } from '@notionhq/client';
import React from 'react';
import {
    BlockObjectResponse,
    PageObjectResponse,
    ParagraphBlockObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

export const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

export function isPageObjectResponse(
    response: unknown
): response is PageObjectResponse {
    return (response as PageObjectResponse).parent !== undefined && (response as PageObjectResponse).object === 'page';
}

export function isBlockObjectResponse(
    response: PageObjectResponse | BlockObjectResponse
): response is BlockObjectResponse {
    return (response as BlockObjectResponse).parent !== undefined && (response as BlockObjectResponse).object === 'block'
}

export function isParagraphBlockObject(
    response: BlockObjectResponse
): response is ParagraphBlockObjectResponse {
    return (response as BlockObjectResponse).type === 'paragraph';
}

type RichTextProperty = Extract<PageObjectResponse['properties'][string], { type: 'rich_text' }>
type DateProperty = Extract<PageObjectResponse['properties'][string], { type: 'date' }>
// type SelectProperty = Extract<PageObjectResponse['properties'][string], { type: 'select' }>
// type TitleProperty = Extract<PageObjectResponse['properties'][string], { type: 'title' }>
// type NumberProperty = Extract<PageObjectResponse['properties'][string], { type: 'number' }>

export function isRichTextProperty(value: unknown): value is RichTextProperty {
    return (value as RichTextProperty)?.type === 'rich_text'
}

export function isDateProperty(value: unknown): value is DateProperty {
    return (value as DateProperty)?.type === 'date'
}


export const fetchPages = React.cache((limit: number) => {
    return notion.databases.query({
        database_id: process.env.NOTION_DATABASE_ID!,
        sorts: [
            {
                property: 'Posted',
                direction: 'descending',
            },
        ],
        filter: {
            and: [
                {
                    property: 'Status',
                    select: {
                        equals: 'Published',
                    },
                }
            ],
        },
        page_size: limit,
    });
});

export const fetchPageBySlug = React.cache((slug: string) => {
    return notion.databases
        .query({
            database_id: process.env.NOTION_DATABASE_ID!,
            filter: {
                property: 'Slug',
                rich_text: {
                    equals: slug,
                },
            },
        })
        .then(res => res.results[0] as PageObjectResponse | undefined);
});

export const fetchPageBlocks = React.cache((pageId: string) => {
    return notion.blocks.children
        .list({ block_id: pageId })
        .then(res => res.results as BlockObjectResponse[]);
});
