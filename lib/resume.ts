import {
    BlockObjectResponse,
    PageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';
import {
    fetchDatabaseRows,
    fetchPageBlocks,
    getFilesFromProperty,
    isDateProperty,
    isFilesProperty,
    isMultiSelectProperty,
    isPageObjectResponse,
    isRelationProperty,
    isRichTextProperty,
    isTitleProperty,
    notion,
} from './notion';
import { toDate } from './util';
import { DateTime } from 'luxon';

export interface ResumePageInterface extends PageObjectResponse {
    blocks: BlockObjectResponse[];
}

export interface Experience {
    id: string;
    name: string;
    company: Company;
    start: DateTime;
    end: DateTime | undefined;
    overview: string;
    bullets: ExperienceBullet[];
}

export interface ExperienceBullet {
    id: string;
    text: string;
    skills: string[];
}

export interface Company {
    id: string;
    title: string;
    icon: string;
}

export interface Education {
    id: string;
    title: string;
    graduationDate: DateTime;
    awards: string[];
    degree: string;
}

export async function getResumePage(): Promise<ResumePageInterface> {
    const response = await notion.pages.retrieve({
        page_id: process.env.NOTION_RESUME_PAGE_ID!,
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

export async function getExperienceList(page: ResumePageInterface) {
    const db = page.blocks.find(
        block =>
            block.type === 'child_database' &&
            block.child_database.title === 'Experience',
    );

    const rows = db?.id ? (await fetchDatabaseRows(db?.id, 100))?.results : [];

    const experienceList = await Promise.all(
        rows.map(async row => {
            if (isPageObjectResponse(row)) {
                const name = isTitleProperty(row.properties.Name)
                    ? row.properties.Name.title[0].plain_text
                    : 'Experience';
                const companyId = isRelationProperty(row.properties.Company)
                    ? row.properties.Company.relation[0].id
                    : '';
                const start = isDateProperty(row.properties.Start)
                    ? toDate(row.properties.Start.date?.start)
                    : '';
                const end = isDateProperty(row.properties.End)
                    ? toDate(row.properties.End.date?.start)
                    : '';
                const overview = isRichTextProperty(row.properties.Overview)
                    ? row.properties.Overview.rich_text[0].plain_text
                    : '';
                const bulletIds = isRelationProperty(row.properties.Bullets)
                    ? row.properties.Bullets.relation.map(r => r.id)
                    : [];

                const bullets = await getExperienceBulletsFromIds(bulletIds);
                const company = await getCompanyFromId(companyId);

                return {
                    id: row.id,
                    name,
                    company,
                    start,
                    end,
                    overview,
                    bullets,
                };
            }
        }),
    );

    return experienceList
        .filter(
            (experience): experience is Experience => experience !== undefined,
        )
        .sort((e1, e2) =>
            e1.start.toUnixInteger() < e2.start.toUnixInteger() ? 1 : -1,
        );
}

export async function getExperienceBulletsFromIds(
    ids: string[],
): Promise<ExperienceBullet[]> {
    const pages = await Promise.all(
        ids.map(async id => notion.pages.retrieve({ page_id: id })),
    );

    return pages.filter(isPageObjectResponse).map(page => ({
        id: page.id,
        text: isTitleProperty(page.properties.Name)
            ? page.properties.Name.title[0].plain_text
            : '',
        skills: isMultiSelectProperty(page.properties.Skills)
            ? page.properties.Skills.multi_select.map(skill => skill.name)
            : [],
    }));
}

export async function getCompanyFromId(id: string): Promise<Company> {
    const response = await notion.pages.retrieve({ page_id: id });
    if (isPageObjectResponse(response)) {
        return {
            id: response.id,
            title: isTitleProperty(response.properties.Name)
                ? response.properties.Name.title[0].plain_text
                : '',
            icon: isFilesProperty(response.properties.Icon)
                ? getFilesFromProperty(response.properties.Icon)?.[0]
                : '',
        };
    }
    throw new Error('Unable to fetch about page');
}

export async function getEducation(
    page: ResumePageInterface,
): Promise<Education[]> {
    const db = page.blocks.find(
        block =>
            block.type === 'child_database' &&
            block.child_database.title === 'Education',
    );

    const rows = db?.id ? (await fetchDatabaseRows(db?.id, 100))?.results : [];

    const education: Education[] = (
        await Promise.all(
            rows.map(async row => {
                if (isPageObjectResponse(row)) {
                    return {
                        id: row.id,
                        title: isTitleProperty(row.properties.Name)
                            ? row.properties.Name.title?.[0].plain_text
                            : '',
                        graduationDate: isDateProperty(
                            row.properties.GraduationDate,
                        )
                            ? toDate(
                                  row.properties.GraduationDate.date?.start,
                              ) || ''
                            : '',
                        awards: isMultiSelectProperty(row.properties.Awards)
                            ? row.properties.Awards.multi_select.map(
                                  award => award.name,
                              )
                            : [],
                        degree: isRichTextProperty(row.properties.Degree)
                            ? row.properties.Degree.rich_text?.[0]?.plain_text
                            : '',
                    };
                }
                return undefined;
            }),
        )
    ).filter((e: unknown): e is Education => e !== undefined);

    return education;
}
