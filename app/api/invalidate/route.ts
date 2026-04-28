import { revalidateTag } from 'next/cache';
import { getBlogPostInvalidationTags } from '@/lib/blog-cache-tags';

function getTagsFromRequest(req: Request): string[] {
    const url = new URL(req.url);
    const fromRepeatedParams = url.searchParams.getAll('tag');
    const fromCsv = url.searchParams
        .get('tags')
        ?.split(',')
        .map(tag => tag.trim())
        .filter(Boolean);

    const allTags = [...fromRepeatedParams, ...(fromCsv ?? [])]
        .map(tag => decodeURIComponent(tag).trim())
        .filter(Boolean);

    return [...new Set(allTags)];
}

/** Optional comma-separated Notion tag names (for `/blog/tag/[tag]` cache rows). */
function getPostTagsFromRequest(req: Request): string[] | undefined {
    const url = new URL(req.url);
    const raw =
        url.searchParams.get('postTags') ?? url.searchParams.get('notionTags');
    if (!raw?.trim()) {
        return undefined;
    }
    const split = raw
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);
    return split.length ? split : undefined;
}

function getSlugFromRequest(req: Request): string | null {
    const url = new URL(req.url);
    const slug =
        url.searchParams.get('slug') ?? url.searchParams.get('postSlug');
    return slug?.trim() ? slug : null;
}

/**
 * User passed only per-post tags but not list/global tags — lists (home, blog index, RSS) may stay stale.
 */
function looksLikePartialBlogPostInvalidation(tags: string[]): boolean {
    if (tags.length === 0 || tags.length > 2) {
        return false;
    }
    const postPrefix = (t: string) =>
        t.startsWith('blog-post-page-') || t.startsWith('blog-post-metadata-');
    return tags.every(postPrefix);
}

export async function GET(req: Request) {
    const url = new URL(req.url);
    const secret = url.searchParams.get('secret');

    if (secret !== process.env.REVALIDATION_SECRET) {
        return new Response('Unauthorized', { status: 401 });
    }

    const slug = getSlugFromRequest(req);
    const notionPostTags = getPostTagsFromRequest(req);
    let expandedFromSlug: string[] | undefined;

    let tags = getTagsFromRequest(req);

    if (slug) {
        expandedFromSlug = getBlogPostInvalidationTags(slug, notionPostTags);
        tags = [...new Set([...tags, ...expandedFromSlug])];
    }

    if (tags.length === 0) {
        return new Response(
            JSON.stringify({
                error: 'Missing tags. Pass tag/tags, or use slug= (and optional postTags=) for full blog post invalidation.',
            }),
            {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            },
        );
    }

    const partialHint = looksLikePartialBlogPostInvalidation(
        getTagsFromRequest(req),
    );

    for (const tag of tags) {
        revalidateTag(tag, 'max');
    }

    return new Response(
        JSON.stringify({
            revalidated: true,
            tags,
            ...(expandedFromSlug ? { expandedFromSlug } : {}),
            ...(partialHint && !slug
                ? {
                      hint: 'You only invalidated post-level tags. Add slug=my-post (and optional postTags=) to also refresh home, blog index, RSS, sitemap, and tag pages.',
                  }
                : {}),
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
}
