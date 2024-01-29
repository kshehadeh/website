import { notion } from './notion';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
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

export async function getPersonalReferences(dbId: string): Promise<PersonalReference[]> {
    const rows = await fetchDatabaseRows(dbId, 10);        
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

export async function getAboutPage(): Promise<PageObjectResponse> {
    const response = await notion.pages.retrieve({ page_id: process.env.NOTION_ABOUT_PAGE_ID! });
    if (isPageObjectResponse(response)) {
        return response;
    }
    throw new Error('Unable to fetch about page');
}
