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

function getReferencesDatabaseId(page: AboutPageInterface): string {
    const referencesDb = page.blocks.find(
        block =>
            block.type === 'child_database' &&
            block.child_database.title === 'References',
    );

    if (!referencesDb) throw new Error('Unable to find references database');
    return referencesDb.id;
}

async function loadPersonalReferences(
    referencesDbId: string,
): Promise<PersonalReference[]> {
    'use cache';
    cacheLife({ stale: 3600, revalidate: 3600 });
    cacheTag('about-page');

    const rows = await fetchDatabaseRows(referencesDbId, 10);
    return Promise.all(
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
}

export async function getPersonalReferences(
    page: AboutPageInterface,
): Promise<PersonalReference[]> {
    return loadPersonalReferences(getReferencesDatabaseId(page));
}

export async function getFooterReferences(): Promise<PersonalReference[]> {
    'use cache';
    cacheLife({ stale: 3600, revalidate: 3600 });
    cacheTag('about-page');

    const page = await getAboutPage();
    return loadPersonalReferences(getReferencesDatabaseId(page));
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
