import { fetchPageBlocks, notion } from './notion';
import { BlockObjectResponse, PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import {
    fetchDatabaseRows,
    isPageObjectResponse,
    isUrlProperty,
    isFilesProperty,
    getFilesFromProperty,
    isTitleProperty,
} from './notion';

export interface PersonalReference {
    id: string;
    title: string;
    url: string;
    icon: string | null;
}

export interface AboutPageInterface extends PageObjectResponse {
    blocks: BlockObjectResponse[];
}

export async function getPersonalReferences(page: AboutPageInterface): Promise<PersonalReference[]> {

    const referencesDb = page.blocks.find(
        block =>
            block.type === 'child_database' &&
            block.child_database.title === 'References',
    );

    if (!referencesDb) throw new Error('Unable to find references database');

    const rows = await fetchDatabaseRows(referencesDb.id, 10);
    return rows.results.filter(isPageObjectResponse).map(row => ({
        id: row.id,
        title: isTitleProperty(row.properties.Name)
            ? row.properties.Name.title[0].plain_text || 'Reference'
            : '',
        url: isUrlProperty(row.properties.URL) ? row.properties.URL.url || '' : '',
        icon: isFilesProperty(row.properties.Icon)
            ? getFilesFromProperty(row.properties.Icon)[0]
            : '',
    }));
}

export async function getAboutPage(): Promise<AboutPageInterface> {
    const response = await notion.pages.retrieve({ page_id: process.env.NOTION_ABOUT_PAGE_ID! });
    if (isPageObjectResponse(response)) {
        const blocks = await fetchPageBlocks(response.id);

        return {
            ...response,
            blocks
        };
    }
    throw new Error('Unable to fetch about page');
}
