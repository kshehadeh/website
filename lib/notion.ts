import 'server-only';

import { Client } from '@notionhq/client';
import React from 'react';
import {
    BlockObjectResponse,
    PageObjectResponse,
    ParagraphBlockObjectResponse,
    UserObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

export const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

export function isPageObjectResponse(
    response: unknown,
): response is PageObjectResponse {
    return (
        (response as PageObjectResponse)?.parent !== undefined &&
        (response as PageObjectResponse)?.object === 'page'
    );
}

export function isBlockObjectResponse(
    response: PageObjectResponse | BlockObjectResponse,
): response is BlockObjectResponse {
    return (
        (response as BlockObjectResponse).parent !== undefined &&
        (response as BlockObjectResponse).object === 'block'
    );
}

export function isParagraphBlockObject(
    response: BlockObjectResponse,
): response is ParagraphBlockObjectResponse {
    return (response as BlockObjectResponse).type === 'paragraph';
}

type RichTextProperty = Extract<
    PageObjectResponse['properties'][string],
    { type: 'rich_text' }
>;
type DateProperty = Extract<
    PageObjectResponse['properties'][string],
    { type: 'date' }
>;
type MultiSelectProperty = Extract<
    PageObjectResponse['properties'][string],
    { type: 'multi_select' }
>;
type CoverProperty = Extract<PageObjectResponse['cover'], { type: 'external' }>;
type AuthorProperty = Extract<
    PageObjectResponse['properties'][string],
    { type: 'people' }
>;
type TitleProperty = Extract<
    PageObjectResponse['properties'][string],
    { type: 'title' }
>;
type UrlProperty = Extract<
    PageObjectResponse['properties'][string],
    { type: 'url' }
>;
type FilesProperty = Extract<
    PageObjectResponse['properties'][string],
    { type: 'files' }
>;
type RelationProperty = Extract<
    PageObjectResponse['properties'][string],
    { type: 'relation' }
>;
type FileProperty = FilesProperty['files'][number];
type InternalFileProperty = {
    file: {
        url: string;
        expiry_time: string;
    };
    name: string;
    type?: 'file';
};

type ExternalFileProperty = {
    external: {
        url: string;
    };
    name: string;
    type?: 'external';
};

// type NumberProperty = Extract<PageObjectResponse['properties'][string], { type: 'number' }>

export function isRichTextProperty(value: unknown): value is RichTextProperty {
    return (value as RichTextProperty)?.type === 'rich_text';
}

export function isUrlProperty(value: unknown): value is UrlProperty {
    return (value as UrlProperty)?.type === 'url';
}

export function isDateProperty(value: unknown): value is DateProperty {
    return (value as DateProperty)?.type === 'date';
}

export function isMultiSelectProperty(
    value: unknown,
): value is MultiSelectProperty {
    return (value as MultiSelectProperty)?.type === 'multi_select';
}

export function isCoverProperty(value: unknown): value is CoverProperty {
    return (value as CoverProperty)?.type === 'external';
}

export function isAuthorProperty(value: unknown): value is AuthorProperty {
    return (value as AuthorProperty)?.type === 'people';
}

export function isFullAuthorDescriptor(
    value: unknown,
): value is UserObjectResponse {
    return (
        (value as UserObjectResponse)?.type === 'person' ||
        (value as UserObjectResponse)?.type === 'bot'
    );
}

export function isTitleProperty(value?: unknown): value is TitleProperty {
    return (value as TitleProperty)?.type === 'title';
}

export function isFilesProperty(value: unknown): value is FilesProperty {
    return (value as FilesProperty)?.type === 'files';
}

export function isInternalFileProperty(
    value: unknown,
): value is InternalFileProperty {
    return (value as FileProperty)?.type === 'file';
}

export function isExternalFileProperty(
    value: unknown,
): value is ExternalFileProperty {
    return (value as FileProperty)?.type === 'external';
}

export function isRelationProperty(value: unknown): value is RelationProperty {
    return (value as RelationProperty)?.type === 'relation';
}

/**
 * This will pull the URL for the associated files in the given files property
 * @param property
 * @returns
 */
export function getFilesFromProperty(property: FilesProperty): string[] {
    return property.files.map(file =>
        isInternalFileProperty(file)
            ? file.file.url
            : isExternalFileProperty(file)
              ? file.external.url
              : '',
    );
}

export const fetchDatabaseRows = React.cache((dbId: string, limit: number) => {
    return notion.databases.query({
        database_id: dbId!,
        page_size: limit,
    });
});

export const fetchPageBlocks = React.cache((pageId: string) => {
    return notion.blocks.children
        .list({ block_id: pageId })
        .then(res => res.results as BlockObjectResponse[]);
});
