import {
    BlockObjectResponse,
    PageObjectResponse,
    QueryDatabaseResponse,
    RichTextItemResponse,
} from '@notionhq/client/build/src/api-endpoints';
import {
    fetchPageBlocks,
    getFinalFileUrl,
    isAuthorProperty,
    isDateProperty,
    isFullAuthorDescriptor,
    isMultiSelectProperty,
    isPageObjectResponse,
    isParagraphBlockObject,
    isRichTextProperty,
    isTitleProperty,
} from './notion';
import { Block } from './notion-renderer/types';
import { notion } from './notion';

export interface Heading {
    level: number;
    text: string;
    children: Heading[];
}

export interface AuthorDetails {
    name: string;
    href: string;
    image: string;
    role: string;
}

export interface BlogPostBrief {
    id: string;
    slug: string;
    title: string;
    date: string;
    href: string;
    tags: string[];
    author: AuthorDetails;
    coverUrl?: string;
    abstract?: string;
}

export interface BlogPostFull extends BlogPostBrief {
    blocks: Block[];
}

export function getPlainTextFromRichTextResponse(
    rich?: RichTextItemResponse[],
): string {
    return rich?.[0]?.plain_text || '';
}

export function getAbstractFromBlocks(blocks: BlockObjectResponse[]): string {
    return (
        blocks
            .filter(isParagraphBlockObject)
            .map(p => p.paragraph.rich_text[0]?.plain_text)
            .join(' ')
            .slice(0, 500) + '...'
    );
}

export async function getAbstractFromPageId(id: string): Promise<string> {
    const result = await fetchPageBlocks(id);
    return getAbstractFromBlocks(result);
}

export function getSlugFromPage(page: PageObjectResponse): string {
    return isRichTextProperty(page.properties.Slug)
        ? page.properties.Slug?.rich_text[0]?.plain_text
        : '';
}

export function getTitleFromPage(page: PageObjectResponse): string {
    return isTitleProperty(page.properties.Name)
        ? page.properties.Name.title[0].plain_text
        : '';
}

export function getPostedDateFromPage(page: PageObjectResponse): string {
    return isDateProperty(page.properties.Posted)
        ? page.properties.Posted.date?.start || ''
        : '';
}

export function getTagsFromPage(page: PageObjectResponse): string[] {
    return isMultiSelectProperty(page.properties.Tags)
        ? page.properties.Tags.multi_select.map(tag => tag.name)
        : [];
}

export function getAuthorFromPage(page: PageObjectResponse): AuthorDetails {
    if (isAuthorProperty(page.properties.Author)) {
        const author = page.properties.Author.people[0];
        if (isFullAuthorDescriptor(author)) {
            return {
                name: author.name ?? '',
                href: `/blog/author/${author.id}`,
                image: author.avatar_url ?? '',
                role: 'Developer',
            };
        }
    }
    return {
        name: '',
        href: `/blog/author/${page.created_by.id}`,
        image: '',
        role: '',
    };
}

export async function getCoverUrlFromPage(
    page: PageObjectResponse,
): Promise<string | undefined> {
    if (page.cover) {
        return getFinalFileUrl(page.cover, page.id);
    }
    return undefined;
}

export async function getBlogBrief({
    post,
    blocks,
    fetchAbstract = false,
}: {
    post: PageObjectResponse;
    blocks?: BlockObjectResponse[];
    fetchAbstract?: boolean;
}): Promise<BlogPostBrief> {
    const id = post.id;
    const slug = getSlugFromPage(post);
    const title = getTitleFromPage(post);
    const date = getPostedDateFromPage(post);
    const tags = getTagsFromPage(post);
    const author = getAuthorFromPage(post);
    const coverUrl = await getCoverUrlFromPage(post);
    const href = `/blog/posts/${slug}`;
    const abstract = blocks
        ? getAbstractFromBlocks(blocks)
        : fetchAbstract
          ? await getAbstractFromPageId(post.id)
          : undefined;

    return {
        id,
        title,
        slug,
        date,
        tags,
        href,
        coverUrl,
        author,
        abstract,
    };
}

export async function getRecentBlogPosts(
    limit: number,
    includeAbstract: boolean,
    tags?: string[],
): Promise<BlogPostBrief[]> {
    const result = await getBlogPosts({ limit, tags });
    const entries = [];
    for (const post of result || []) {
        if (isPageObjectResponse(post)) {
            entries.push(
                await getBlogBrief({ post, fetchAbstract: includeAbstract }),
            );
        }
    }

    return entries;
}

export async function getBlogPostBySlug(
    slug: string,
): Promise<BlogPostFull | undefined> {
    // get the page for this slug
    const post = (await getBlogPosts({ limit: 1, slug, status: 'Any' }))?.[0];

    if (isPageObjectResponse(post)) {
        // get the blocks for this page, including content
        const blocks = await fetchPageBlocks(post.id);

        return {
            ...(await getBlogBrief({ post, blocks })),
            blocks,
        };
    }
}

export async function getBlogPostsByTag(
    tags: string[],
): Promise<BlogPostBrief[]> {
    const result = await getBlogPosts({
        limit: 100,
        tags,
    });

    const entries = [];
    for (const post of result) {
        if (isPageObjectResponse(post)) {
            entries.push(await getBlogBrief({ post }));
        }
    }

    return entries;
}

export async function getBlogPosts({
    limit,
    tags,
    authorId,
    slug,
    status = 'Published',
    sortBy = {
        property: 'Posted',
        direction: 'descending',
    },
}: {
    limit?: number;
    tags?: string[];
    authorId?: string;
    slug?: string;
    status?: 'Published' | 'Draft' | 'Any';
    sortBy?: {
        property: string;
        direction: 'ascending' | 'descending';
    };
}): Promise<QueryDatabaseResponse['results']> {
    const and = [];
    if (status && status !== 'Any') {
        and.push({
            property: 'Status',
            select: {
                equals: status,
            },
        });
    }

    if (tags) {
        and.push({
            or: tags?.map(tag => ({
                property: 'Tags',
                multi_select: {
                    contains: tag,
                },
            })),
        });
    }

    if (authorId) {
        and.push({
            property: 'Author',
            people: {
                contains: authorId,
            },
        });
    }

    if (slug) {
        and.push({
            property: 'Slug',
            rich_text: {
                equals: slug,
            },
        });
    }

    const results = await notion.databases.query({
        database_id: process.env.NOTION_BLOG_POSTS_DATABASE_ID!,
        sorts: [
            {
                property: sortBy.property,
                direction: sortBy.direction,
            },
        ],
        filter: { and },
        page_size: limit,
    });

    if (results) {
        return results.results.filter(isPageObjectResponse);
    } else {
        return [];
    }
}

export function getBlogPostHeadings(post: BlogPostFull): Heading[] {
    const headings: Heading[] = [];
    for (const block of post.blocks) {
        if (block.type.startsWith('heading')) {
            headings.push({
                level: parseInt(block.type.split('_')[1]),
                text: getPlainTextFromRichTextResponse(
                    block[block.type].rich_text,
                ),
                children: [],
            });
        }
    }

    return headings;
}

export function getAnchorIdFromHeading(str: string) {
    return str.toLowerCase().replace(/\s/g, '-');
}
