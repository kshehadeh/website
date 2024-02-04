import {
    BlockObjectResponse,
    PageObjectResponse,
    QueryDatabaseResponse,
    RichTextItemResponse,
} from '@notionhq/client/build/src/api-endpoints';
import {
    fetchPageBlocks,
    isAuthorProperty,
    isDateProperty,
    isExternalFileProperty,
    isFullAuthorDescriptor,
    isInternalFileProperty,
    isMultiSelectProperty,
    isPageObjectResponse,
    isParagraphBlockObject,
    isRichTextProperty,
    isTitleProperty,
} from './notion';
import { Block } from './notion-renderer/types';
import { notion } from './notion';

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
    return getPlainTextFromRichTextResponse(
        blocks.find(isParagraphBlockObject)?.paragraph.rich_text,
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

export function getCoverUrlFromPage(page: PageObjectResponse): string {
    if (isInternalFileProperty(page.cover)) {
        return page.cover.file.url;
    } else if (isExternalFileProperty(page.cover)) {
        return page.cover.external.url;
    }
    return '';
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
    const coverUrl = getCoverUrlFromPage(post);
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
): Promise<BlogPostBrief[]> {
    const result = await getBlogPosts({ limit });
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

export async function getBlogPostsByTag(tag: string): Promise<BlogPostBrief[]> {
    const result = await getBlogPosts({
        limit: 100,
        tag,
    });

    const entries = [];
    for (const post of result) {
        if (isPageObjectResponse(post)) {
            const tags = getTagsFromPage(post);
            if (tags.includes(tag)) {
                entries.push(await getBlogBrief({ post }));
            }
        }
    }

    return entries;
}

export async function getBlogPosts({
    limit,
    tag,
    authorId,
    slug,
    status = 'Published',
    sortBy = {
        property: 'Posted',
        direction: 'descending',
    },
}: {
    limit?: number;
    tag?: string;
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

    if (tag) {
        and.push({
            property: 'Tags',
            multi_select: {
                contains: tag,
            },
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
        return results.results;
    } else {
        return [];
    }
}
