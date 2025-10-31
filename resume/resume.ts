import { Client } from '@notionhq/client';
import type {
    BlockObjectResponse,
    ChildDatabaseBlockObjectResponse,
    PageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';
import { config } from 'dotenv';
import { DateTime, Duration } from 'luxon';
import path from 'path';
import { q } from '@kshehadeh/cmdq';
import fs from 'fs';
import ora from 'ora';

// Load environment variables
const rootDir = __dirname;
config();

// Initialize the Notion client
const notion = new Client({ auth: process.env.NOTION_TOKEN });
const spinner = ora('Building resume...').start();

// Converts a Duration object to a human-readable string
function toHuman(dt: Duration | undefined | null, andCounting: boolean) {
    if (!dt) {
        return '';
    }

    const pluralize = (unit: string, count: number) => {
        return count === 1 ? unit : `${unit}s`;
    };

    let str = '';
    if (dt.years > 0 && dt.months > 0) {
        str = dt.toFormat(
            `y '${pluralize('year', dt.years)}' M '${pluralize('month', dt.months)}'`,
        );
    } else if (dt.years > 0) {
        str = dt.toFormat(`y '${pluralize('year', dt.years)}'`);
    } else if (dt.months > 0) {
        str = dt.toFormat(`M '${pluralize('month', dt.months)}'`);
    }

    if (andCounting) {
        str = 'Current Position';
    }

    return str;
}

// Rounds the months in a Duration object
function roundMonths(dt: Duration) {
    if (dt.months > 0) {
        const rounded = Math.round(dt.months);
        if (rounded === 0) {
            return Duration.fromObject({ years: dt.years });
        } else {
            return dt.set({ months: rounded });
        }
    }
    return dt;
}

// Sorts properties by their end dates
const sortPropertiesByEndDates = (
    a: PageObjectResponse,
    b: PageObjectResponse,
) => {
    const aEnd = getPropertyDate(a.properties.Dates).end;
    const bEnd = getPropertyDate(b.properties.Dates).end;

    if (bEnd && !aEnd) {
        return 1;
    }

    if (aEnd && !bEnd) {
        return -1;
    }

    if (aEnd && bEnd) {
        return aEnd.toMillis() - bEnd.toMillis();
    }

    return 0;
};

// Fetches blocks from a Notion page
async function getBlocks(id: string) {
    try {
        const response = await notion.blocks.children.list({
            block_id: id,
        });
        return response.results as BlockObjectResponse[];
    } catch (error) {
        console.error('Error fetching blocks:', error);
        throw error;
    }
}

// Fetches rows from a Notion database
async function getRows(databaseId: string) {
    try {
        // Get the data source ID from the database ID
        const database = await notion.databases.retrieve({
            database_id: databaseId,
        });
        const dataSourceId =
            'data_sources' in database && database.data_sources.length > 0
                ? database.data_sources[0].id
                : databaseId; // Fallback to database ID if no data sources found

        const response = await notion.dataSources.query({
            data_source_id: dataSourceId,
        });
        return response.results.filter(o => o.object === 'page');
    } catch (error) {
        console.error('Error fetching rows:', error);
        throw error;
    }
}

// Retrieves the text from a property
function getPropertyText(property: PageObjectResponse['properties'][number]) {
    if (property.type === 'title') {
        return property.title[0].plain_text;
    } else if (property.type === 'rich_text') {
        return property.rich_text[0].plain_text;
    }
    return null;
}

// Retrieves the number from a property
function getProperyNumber(property: PageObjectResponse['properties'][number]) {
    if (property.type === 'number') {
        return property.number;
    }
    return null;
}

// Retrieves the multi-select options from a property
function getPropertyMultiSelect(
    property: PageObjectResponse['properties'][number],
) {
    if (property.type === 'multi_select') {
        return property.multi_select.map(option => option.name);
    }
    return null;
}

function getPropertyRelation(
    property: PageObjectResponse['properties'][number],
    lookupRows: PageObjectResponse[],
) {
    if (property.type === 'relation') {
        return property.relation.map(option => {
            const row = lookupRows.find(row => row.id === option.id);
            if (row) {
                const ob: Record<string, unknown> = {};
                for (const key in row.properties) {
                    if (row.properties[key].type === 'title') {
                        ob[key] = getPropertyText(row.properties[key]);
                    } else if (row.properties[key].type === 'rich_text') {
                        ob[key] = getPropertyText(row.properties[key]);
                    } else if (row.properties[key].type === 'number') {
                        ob[key] = row.properties[key].number;
                    } else if (row.properties[key].type === 'select') {
                        ob[key] = row.properties[key].select?.name;
                    } else if (row.properties[key].type === 'multi_select') {
                        ob[key] = row.properties[key].multi_select.map(
                            option => option.name,
                        );
                    }
                }
                return ob;
            }
        });
    }
    return null;
}

// Retrieves a value from the "About" section by key
function getAboutValueWithKey(rows: PageObjectResponse[], key: string) {
    const row = rows.find(row => getPropertyText(row.properties.Name) === key);
    if (!row) {
        return null;
    }
    return getPropertyText(row.properties.Text);
}

// Builds the "About" information
async function buildAboutInfo(
    data: Record<string, ChildDatabaseBlockObjectResponse>,
) {
    const dbId = data['About'].id;
    const rows = (await getRows(dbId)) as PageObjectResponse[];
    return {
        intro: getAboutValueWithKey(rows, 'Intro'),
        tagline: getAboutValueWithKey(rows, 'Tagline'),
        location: getAboutValueWithKey(rows, 'Location'),
        linkedin: getAboutValueWithKey(rows, 'LinkedIn'),
        github: getAboutValueWithKey(rows, 'Github'),
        web: getAboutValueWithKey(rows, 'Web'),
        phone: getAboutValueWithKey(rows, 'Phone'),
        email: getAboutValueWithKey(rows, 'Email'),
        name: getAboutValueWithKey(rows, 'Name'),
    };
}

// Retrieves the date from a property
function getPropertyDate(property: PageObjectResponse['properties'][number]) {
    if (property.type === 'date') {
        if (property.date?.start && property.date?.end) {
            const start = DateTime.fromISO(property.date.start);
            const end = DateTime.fromISO(property.date.end);
            const duration = roundMonths(
                end.diff(start, ['years', 'months'], {
                    conversionAccuracy: 'longterm',
                }),
            );
            return {
                start,
                end,
                duration,
            };
        }

        if (property.date?.start) {
            const duration = roundMonths(
                DateTime.now().diff(
                    DateTime.fromISO(property.date.start),
                    ['years', 'months'],
                    { conversionAccuracy: 'longterm' },
                ),
            );
            return { start: DateTime.fromISO(property.date?.start), duration };
        } else if (property.date?.end) {
            return { end: DateTime.fromISO(property.date?.end) };
        }
    }
    return { start: null, end: null, duration: null };
}

async function getSkillsList(
    databases: Record<string, ChildDatabaseBlockObjectResponse>,
) {
    return (await getRows(databases['Skills'].id)) as PageObjectResponse[];
}

// Builds the experience list
async function buildExperienceList(
    data: Record<string, ChildDatabaseBlockObjectResponse>,
    skills: PageObjectResponse[],
) {
    spinner.text = 'Reading company data';
    const companies = (await getRows(
        data['Companies'].id,
    )) as PageObjectResponse[];

    spinner.text = 'Reading experience data';
    const experience = (await getRows(
        data['Experience'].id,
    )) as PageObjectResponse[];
    const experienceBullets = (await getRows(
        data['Experience Bullets'].id,
    )) as PageObjectResponse[];

    companies.sort(sortPropertiesByEndDates).reverse();

    const experienceList = companies.map(company => {
        spinner.text = `Processing ${getPropertyText(company.properties.Name)}`;

        const expForCompany = experience.filter(
            exp =>
                (exp.properties.Company.type === 'relation' &&
                    exp.properties.Company.relation[0].id) === company.id,
        );
        expForCompany.sort(sortPropertiesByEndDates).reverse();

        const { start, end } = getPropertyDate(company.properties.Dates);
        return {
            company: getPropertyText(company.properties.Name),
            start: start?.toFormat('MMMM yyyy'),
            end: end?.toFormat('MMMM yyyy') ?? 'Present',
            experience: expForCompany.map(exp => {
                spinner.text = `Processing ${getPropertyText(exp.properties.Name)}`;
                const bulletsForExperience = experienceBullets
                    .filter(
                        bullet =>
                            (bullet.properties.Experience.type === 'relation' &&
                                bullet.properties.Experience.relation[0].id) ===
                            exp.id,
                    )
                    .reverse();
                const { start, end, duration } = getPropertyDate(
                    exp.properties.Dates,
                );
                return {
                    title: getPropertyText(exp.properties.Name),
                    start: start?.toFormat('MMMM yyyy'),
                    end: end?.toFormat('MMMM yyyy') ?? 'Present',
                    duration: toHuman(duration, !end),
                    domain: getPropertyRelation(exp.properties.Domain, skills),
                    bullets: bulletsForExperience.map(bullet => {
                        return {
                            text: getPropertyText(bullet.properties.Name),
                            skills: getPropertyRelation(
                                bullet.properties.Skill,
                                skills,
                            ),
                        };
                    }),
                };
            }),
        };
    });

    return experienceList;
}

// Builds the education list
async function buildEducationList(
    data: Record<string, ChildDatabaseBlockObjectResponse>,
) {
    spinner.text = 'Reading education data';
    const education = (await getRows(
        data['Education'].id,
    )) as PageObjectResponse[];

    const educationList = education.map(edu => {
        spinner.text = `Processing ${getPropertyText(edu.properties.Name)}`;
        const { start, end } = getPropertyDate(edu.properties.GraduationDate);

        return {
            institution: getPropertyText(edu.properties.Name),
            degree: getPropertyText(edu.properties.Degree),
            major: getPropertyText(edu.properties.Major),
            start: start?.toFormat('MMMM yyyy'),
            end: end?.toFormat('MMMM yyyy') ?? 'Present',
            awards: getPropertyMultiSelect(edu.properties.Awards),
            gpa: getProperyNumber(edu.properties.GPA),
        };
    });

    return educationList;
}

// Example usage
(async () => {
    // get the first parameter passed to the script and assume that it's the output file
    let outputFile = process.argv[2];
    if (!outputFile) {
        outputFile = 'karim-shehadeh-resume.pdf';
    }

    outputFile = path.resolve('./', outputFile);

    // check if directory exists
    if (!fs.existsSync(path.dirname(outputFile))) {
        console.error(`Directory ${path.dirname(outputFile)} does not exist`);
        process.exit(1);
    }

    const documentOrDatabaseId = 'b8fed2f709c64d139c1f5a77c469d511';
    const blocks = await getBlocks(documentOrDatabaseId);

    const databases = blocks
        .filter(block => block.type === 'child_database')
        .reduce<Record<string, ChildDatabaseBlockObjectResponse>>(
            (acc, block) => {
                acc[block.child_database.title] = block;
                return acc;
            },
            {},
        );

    const skills = await getSkillsList(databases);
    const experiences = await buildExperienceList(databases, skills);
    const education = await buildEducationList(databases);
    const about = await buildAboutInfo(databases);

    const data = {
        name: about.name,
        tagline: about.tagline,
        intro: about.intro,
        email: about.email,
        phone: about.phone,
        linkedin: about.linkedin,
        github: about.github,
        web: about.web,
        location: about.location,
        experiences,
        education,
    };

    const outputPath = path.join(rootDir, '/typst/resume.json');
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

    const pathToTemplate = path.join(rootDir, '/typst/main.typ');
    const output = q()
        .add(`typst compile ${pathToTemplate} ${outputFile}`)
        .run()
        .last();
    if (!output?.result.success) {
        console.log(
            output?.result.message ||
                `Error compiling template (error code ${output?.stat})`,
        );
    }

    spinner.stopAndPersist({ text: 'Resume built successfully' });
})();
