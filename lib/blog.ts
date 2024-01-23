import { BlockObjectResponse, PageObjectResponse, RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';
import { fetchPageBlocks, fetchPageBySlug, fetchPages, isDateProperty, isPageObjectResponse, isParagraphBlockObject, isRichTextProperty, notion } from './notion';
import { NotionRenderer } from './notion-renderer';

export interface BlogPostBrief {
    slug: string;
    title: string;
    date: string;
    abstract: string;
}

export interface BlogPostFull {
    slug: string;
    title: string;
    date: string;
    abstract: string;
    contentAsRenderedHtml: string;
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
    return isRichTextProperty(page.properties.Name) ? page.properties.Name.rich_text[0].plain_text : '';
}

export function getPostedDateFromPage(page: PageObjectResponse): string {
    return isDateProperty(page.properties.Posted) ? page.properties.Posted.date?.start || '' : '';
}

export async function getRecentBlogPosts(
    limit: number,
    includeAbstract: boolean
): Promise<BlogPostBrief[]> {
    const result = await fetchPages(limit);
    const entries = []
    for (const page of result?.results || []) {
        if (isPageObjectResponse(page)) {
            const slug = getSlugFromPage(page);
            const title = getTitleFromPage(page);
            const date = getPostedDateFromPage(page);
            entries.push({
                title,
                slug,
                date,
                abstract: includeAbstract ? await getAbstractFromPageId(page.id) : '',
            });    
        }
    }

    return entries
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostFull | undefined> {
    const post = await fetchPageBySlug(slug);
    if (post) {
        const blocks = await fetchPageBlocks(post.id);
        const contentAsRenderedHtml = await (new NotionRenderer({client: notion}).render(...blocks));
        const slug = getSlugFromPage(post);
        const title = getTitleFromPage(post);
        const date = getPostedDateFromPage(post);
        const abstract = getAbstractFromBlocks(blocks)
        
        return {
            slug,
            title,
            date,
            abstract,
            contentAsRenderedHtml
        }
    }
}
