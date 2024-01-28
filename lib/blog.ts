import { BlockObjectResponse, PageObjectResponse, RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';
import { fetchPageBlocks, fetchPageBySlug, fetchPages, isAuthorProperty, isCoverProperty, isDateProperty, isFullAuthorDescriptor, isMultiSelectProperty, isPageObjectResponse, isParagraphBlockObject, isRichTextProperty, isTitleProperty } from './notion';
import { Block } from './notion-renderer/types';

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

export function getPlainTextFromRichTextResponse(rich?: RichTextItemResponse[]): string {
    return rich?.[0]?.plain_text || '';
}

export function getAbstractFromBlocks(blocks: BlockObjectResponse[]): string {
    return  getPlainTextFromRichTextResponse(blocks.find(isParagraphBlockObject)?.paragraph.rich_text);
}

export async function getAbstractFromPageId(id: string): Promise<string> {
    const result = await fetchPageBlocks(id);
    return getAbstractFromBlocks(result);    
}

export function getSlugFromPage(page: PageObjectResponse): string {
    return isRichTextProperty(page.properties.Slug) ? page.properties.Slug.rich_text[0].plain_text : '';
}

export function getTitleFromPage(page: PageObjectResponse): string {
    return isTitleProperty(page.properties.Name) ? page.properties.Name.title[0].plain_text : '';
}

export function getPostedDateFromPage(page: PageObjectResponse): string {
    return isDateProperty(page.properties.Posted) ? page.properties.Posted.date?.start || '' : '';
}

export function getTagsFromPage(page: PageObjectResponse): string[] {
    return isMultiSelectProperty(page.properties.Tags) ? page.properties.Tags.multi_select.map((tag) => tag.name) : [];
}

export function getAuthorFromPage(page: PageObjectResponse): AuthorDetails {
    if (isAuthorProperty(page.properties.Author)) {
        const author = page.properties.Author.people[0];
        if (isFullAuthorDescriptor(author)) {
            return {
                name: author.name ?? '',
                href: `/blog/author/${author.id}`,
                image: author.avatar_url ?? '',
                role: 'Developer'
            }    
        }
    }
    return {
        name: '',
        href: `/blog/author/${page.created_by.id}`,
        image: '',
        role: ''
    }
}

export function getCoverUrlFromPage(page: PageObjectResponse): string {
    return isCoverProperty(page.cover) ? page.cover.external.url : '';
}

export async function getBlogBrief({ post, blocks, fetchAbstract = false }: { post: PageObjectResponse; blocks?: BlockObjectResponse[]; fetchAbstract?: boolean; }): Promise<BlogPostBrief> {    
    const id = post.id;
    const slug = getSlugFromPage(post);
    const title = getTitleFromPage(post);
    const date = getPostedDateFromPage(post);
    const tags = getTagsFromPage(post);
    const author = getAuthorFromPage(post);
    const coverUrl = getCoverUrlFromPage(post);
    const href = `/blog/posts/${slug}`;
    const abstract = blocks ? getAbstractFromBlocks(blocks) : fetchAbstract ? await getAbstractFromPageId(post.id) : undefined;

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
    includeAbstract: boolean
): Promise<BlogPostBrief[]> {
    const result = await fetchPages(limit);
    const entries = []
    for (const post of result?.results || []) {
        if (isPageObjectResponse(post)) {
            entries.push(await getBlogBrief({ post, fetchAbstract: includeAbstract }));
        }
    }

    return entries
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostFull | undefined> {
    // get the page for this slug
    const post = await fetchPageBySlug(slug);
    if (post) {
        // get the blocks for this page, including content
        const blocks = await fetchPageBlocks(post.id);

        return {
            ...(await getBlogBrief({ post, blocks })),
            blocks
        }
    }
}
