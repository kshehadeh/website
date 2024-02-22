import {
    BlockObjectResponse,
    PageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';
import { getAbstractFromBlocks } from './blog';
import {
    fetchPageBlocks,
    isMultiSelectProperty,
    isPageObjectResponse,
    isTitleProperty,
    isUrlProperty,
    notion,
} from './notion';

export interface Bookmark {
    id: string;
    title: string;
    url: string;
    tags: string[];
    abstract: string;
}

export function getSummaryFromBlocks(blocks: BlockObjectResponse[]): string {
    return getAbstractFromBlocks(blocks);
}

export async function getRecentBookmarks(limit = 10): Promise<Bookmark[]> {
    const results = await notion.databases.query({
        database_id: process.env.NOTION_BOOKMARKS_DATABASE_ID!,
        sorts: [
            {
                property: 'Created',
                direction: 'descending',
            },
        ],
        filter: {
            property: 'Tags',
            multi_select: {
                contains: 'site',
            },
        },
        page_size: limit,
    });

    if (results) {
        return Promise.all(
            results.results.filter(isPageObjectResponse).map(mapPageToBookmark),
        );
    } else {
        return [];
    }
}

export async function getBookmarksByTag(tag: string): Promise<Bookmark[]> {
    const results = await notion.databases.query({
        database_id: process.env.NOTION_BOOKMARKS_DATABASE_ID!,
        sorts: [
            {
                property: 'Created',
                direction: 'descending',
            },
        ],
        filter: {
            and: [
                {
                    property: 'Tags',
                    multi_select: {
                        contains: 'site',
                    },
                },
                {
                    property: 'Tags',
                    multi_select: {
                        contains: tag,
                    },
                },
            ],
        },
        page_size: 100,
    });

    if (results) {
        return Promise.all(
            results.results.filter(isPageObjectResponse).map(mapPageToBookmark),
        );
    } else {
        return [];
    }
}

async function mapPageToBookmark(page: PageObjectResponse): Promise<Bookmark> {
    const blocks = await fetchPageBlocks(page.id);
    const abstract = getSummaryFromBlocks(blocks);
    return {
        id: page.id,
        title: isTitleProperty(page.properties.Name)
            ? page.properties.Name.title[0].plain_text
            : '',
        url: isUrlProperty(page.properties.URL)
            ? page.properties.URL.url || ''
            : '',
        tags: isMultiSelectProperty(page.properties.Tags)
            ? page.properties.Tags.multi_select
                  .filter(tag => tag.name !== 'site')
                  .map(tag => tag.name)
            : [],
        abstract,
    };
}
