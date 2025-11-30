import { fetchPageBlocks, getFinalFileUrls, notion } from './notion';
import {
    BlockObjectResponse,
    PageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';
import {
    fetchDatabaseRows,
    isPageObjectResponse,
    isUrlProperty,
    isFilesProperty,
    isTitleProperty,
} from './notion';
import { cacheLife, cacheTag } from 'next/cache';

export interface PersonalReference {
    id: string;
    title: string;
    url: string;
    icon: string | null;
}

export interface AboutPageInterface extends PageObjectResponse {
    blocks: BlockObjectResponse[];
}

export async function getPersonalReferences(
    page: AboutPageInterface,
): Promise<PersonalReference[]> {
    const referencesDb = page.blocks.find(
        block =>
            block.type === 'child_database' &&
            block.child_database.title === 'References',
    );

    if (!referencesDb) throw new Error('Unable to find references database');

    const rows = await fetchDatabaseRows(referencesDb.id, 10);
    const results = await Promise.all(
        rows.results.filter(isPageObjectResponse).map(async row => ({
            id: row.id,
            title: isTitleProperty(row.properties.Name)
                ? row.properties.Name.title[0].plain_text || 'Reference'
                : '',
            url: isUrlProperty(row.properties.URL)
                ? row.properties.URL.url || ''
                : '',
            icon: isFilesProperty(row.properties.Icon)
                ? (await getFinalFileUrls(row.properties.Icon, 'about')).at(
                      0,
                  ) || null
                : null,
        })),
    );

    return results;
}

export async function getAboutPage(): Promise<AboutPageInterface> {
    'use cache';
    cacheLife({ stale: 3600, revalidate: 3600 });
    cacheTag('about-page');

    const response = await notion.pages.retrieve({
        page_id: process.env.NOTION_ABOUT_PAGE_ID!,
    });
    if (isPageObjectResponse(response)) {
        const blocks = await fetchPageBlocks(response.id);

        return {
            ...response,
            blocks,
        };
    }
    throw new Error('Unable to fetch about page');
}
