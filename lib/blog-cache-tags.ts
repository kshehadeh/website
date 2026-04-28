/**
 * Central tags for blog/list RSS/sitemap caches so invalidation and `cacheTag()` stay aligned.
 * Post slug tags are built with the same normalization as blog routes (decodeURIComponent).
 */

export const BLOG_RSS_CACHE_TAG = 'blog-rss';
export const BLOG_SITEMAP_CACHE_TAG = 'blog-sitemap';

export const BLOG_INDEX_CACHE_TAGS = ['blog-page', 'blog-page-metadata'] as const;
export const HOME_PAGE_CACHE_TAGS = ['home-page', 'home-page-metadata'] as const;

export function normalizeBlogSlugParam(slug: string): string {
    return decodeURIComponent(slug);
}

/**
 * Tags to revalidate when a single blog post changes. Optionally include Notion tag names
 * so `/blog/tag/[tag]` pages refresh (pass as comma-separated `postTags` on invalidate URL).
 */
export function getBlogPostInvalidationTags(
    slug: string,
    notionPostTags?: string[],
): string[] {
    const normalized = normalizeBlogSlugParam(slug.trim());
    const tags = new Set<string>([
        `blog-post-page-${normalized}`,
        `blog-post-metadata-${normalized}`,
        ...BLOG_INDEX_CACHE_TAGS,
        ...HOME_PAGE_CACHE_TAGS,
        BLOG_RSS_CACHE_TAG,
        BLOG_SITEMAP_CACHE_TAG,
    ]);
    if (notionPostTags?.length) {
        for (const t of notionPostTags) {
            const name = t.trim();
            if (name) {
                tags.add(`blog-tag-page-${name}`);
                tags.add(`blog-tag-metadata-${name}`);
            }
        }
    }
    return [...tags];
}
