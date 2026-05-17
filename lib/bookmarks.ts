import {
    BlockObjectResponse,
    PageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';
import { getAbstractFromBlocks } from './blog';
import {
    fetchPageBlocks,
    getDataSourceIdFromDatabaseId,
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

export interface BookmarkLink {
    id: string;
    title: string;
    url: string;
}

export function getSummaryFromBlocks(blocks: BlockObjectResponse[]): string {
    return getAbstractFromBlocks(blocks);
}

export async function getRecentBookmarks(limit = 10): Promise<Bookmark[]> {
    const dataSourceId = await getDataSourceIdFromDatabaseId(
        process.env.NOTION_BOOKMARKS_DATABASE_ID!,
    );
    const results = await notion.dataSources.query({
        data_source_id: dataSourceId,
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

export async function getRecentBookmarkLinks(
    limit = 10,
): Promise<BookmarkLink[]> {
    const dataSourceId = await getDataSourceIdFromDatabaseId(
        process.env.NOTION_BOOKMARKS_DATABASE_ID!,
    );
    const results = await notion.dataSources.query({
        data_source_id: dataSourceId,
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
        return results.results.filter(isPageObjectResponse).map(page => ({
            id: page.id,
            title: isTitleProperty(page.properties.Name)
                ? page.properties.Name.title[0].plain_text
                : '',
            url: isUrlProperty(page.properties.URL)
                ? page.properties.URL.url || ''
                : '',
        }));
    } else {
        return [];
    }
}

export async function getBookmarksByTag(tag: string): Promise<Bookmark[]> {
    if (!tag) {
        return [];
    }

    const dataSourceId = await getDataSourceIdFromDatabaseId(
        process.env.NOTION_BOOKMARKS_DATABASE_ID!,
    );
    const results = await notion.dataSources.query({
        data_source_id: dataSourceId,
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

export async function getBookmarkTags(): Promise<string[]> {
    const dataSourceId = await getDataSourceIdFromDatabaseId(
        process.env.NOTION_BOOKMARKS_DATABASE_ID!,
    );
    const results = await notion.dataSources.query({
        data_source_id: dataSourceId,
        filter: {
            property: 'Tags',
            multi_select: {
                contains: 'site',
            },
        },
        page_size: 100,
    });

    if (!results) {
        return [];
    }

    return [
        ...new Set(
            results.results
                .filter(isPageObjectResponse)
                .flatMap(page =>
                    isMultiSelectProperty(page.properties.Tags)
                        ? page.properties.Tags.multi_select
                              .filter(tag => tag.name !== 'site')
                              .map(tag => tag.name)
                        : [],
                ),
        ),
    ].sort((left, right) => left.localeCompare(right));
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
