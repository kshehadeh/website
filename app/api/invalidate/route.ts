import { revalidateTag } from 'next/cache';
import { getBlogPostInvalidationTags } from '@/lib/blog-cache-tags';

interface InvalidatePayload {
    secret?: string;
    slug?: string;
    postSlug?: string;
    tag?: string;
    tags?: string;
    postTags?: string;
    notionTags?: string;
}

function getTagsFromRequest(req: Request, body?: InvalidatePayload): string[] {
    const url = new URL(req.url);
    const fromRepeatedParams = url.searchParams.getAll('tag');
    const fromCsv =
        url.searchParams
            .get('tags')
            ?.split(',')
            .map(t => t.trim())
            .filter(Boolean) ??
        body?.tags
            ?.split(',')
            .map(t => t.trim())
            .filter(Boolean);

    const bodyTag = body?.tag;
    const allTags = [
        ...fromRepeatedParams,
        ...(fromCsv ?? []),
        ...(bodyTag ? [bodyTag] : []),
    ]
        .map(tag => decodeURIComponent(tag).trim())
        .filter(Boolean);

    return [...new Set(allTags)];
}

/** Optional comma-separated Notion tag names (for `/blog/tag/[tag]` cache rows). */
function getPostTagsFromRequest(
    req: Request,
    body?: InvalidatePayload,
): string[] | undefined {
    const url = new URL(req.url);
    const raw =
        url.searchParams.get('postTags') ??
        url.searchParams.get('notionTags') ??
        body?.postTags ??
        body?.notionTags;
    if (!raw?.trim()) {
        return undefined;
    }
    const split = raw
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);
    return split.length ? split : undefined;
}

function getSlugFromRequest(
    req: Request,
    body?: InvalidatePayload,
): string | null {
    const url = new URL(req.url);
    const slug =
        url.searchParams.get('slug') ??
        url.searchParams.get('postSlug') ??
        body?.slug ??
        body?.postSlug;
    return slug?.trim() ? slug : null;
}

function getSecretFromRequest(
    req: Request,
    body?: InvalidatePayload,
): string | null {
    const url = new URL(req.url);
    return url.searchParams.get('secret') ?? body?.secret ?? null;
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

async function handleInvalidation(req: Request): Promise<Response> {
    // #region agent log
    console.info(
        JSON.stringify({
            sessionId: 'f75588',
            runId: 'baseline',
            hypothesisId: 'H1',
            location: 'app/api/invalidate/route.ts:96',
            message: 'invalidate endpoint hit',
            data: { method: req.method, url: req.url },
        }),
    );
    // #endregion
    let body: InvalidatePayload | undefined;
    if (req.method === 'POST') {
        try {
            body = (await req.json()) as InvalidatePayload;
        } catch {
            body = undefined;
        }
    }

    const secret = getSecretFromRequest(req, body);
    if (secret !== process.env.REVALIDATION_SECRET) {
        return new Response('Unauthorized', { status: 401 });
    }

    const slug = getSlugFromRequest(req, body);
    const notionPostTags = getPostTagsFromRequest(req, body);
    let expandedFromSlug: string[] | undefined;

    let tags = getTagsFromRequest(req, body);

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
        getTagsFromRequest(req, body),
    );

    for (const tag of tags) {
        revalidateTag(tag, { expire: 0 });
    }
    // #region agent log
    console.info(
        JSON.stringify({
            sessionId: 'f75588',
            runId: 'baseline',
            hypothesisId: 'H1',
            location: 'app/api/invalidate/route.ts:141',
            message: 'invalidate endpoint revalidated tags',
            data: { slug, tagsCount: tags.length, tags },
        }),
    );
    // #endregion

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

export async function GET(req: Request) {
    return handleInvalidation(req);
}

export async function POST(req: Request) {
    return handleInvalidation(req);
}
