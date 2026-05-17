import { revalidateTag } from 'next/cache';
import { getBlogPostInvalidationTags } from '@/lib/blog-cache-tags';
import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

function warmCache(urls: string[]) {
    for (const url of urls) {
        fetch(new URL(url, BASE_URL).toString(), { method: 'GET' }).catch(
            () => {},
        );
    }
}

interface NotionWebhookBody {
    source?: {
        type?: string;
        automation_id?: string;
    };
    data?: {
        object?: string;
        id?: string;
        in_trash?: boolean;
        is_archived?: boolean;
        parent?: {
            type?: string;
            database_id?: string;
            data_source_id?: string;
            page_id?: string;
        };
        properties?: Record<string, unknown>;
    };
}

function getSlugFromProperties(
    properties: Record<string, unknown>,
): string | null {
    const slugProp = properties['Slug'];
    if (
        slugProp &&
        typeof slugProp === 'object' &&
        'rich_text' in slugProp &&
        Array.isArray((slugProp as { rich_text: unknown[] }).rich_text) &&
        (slugProp as { rich_text: { plain_text?: string }[] }).rich_text
            .length > 0
    ) {
        return (
            (slugProp as { rich_text: { plain_text?: string }[] }).rich_text[0]
                .plain_text ?? null
        );
    }
    return null;
}

function getTagsFromProperties(properties: Record<string, unknown>): string[] {
    const tagsProp = properties['Tags'];
    if (
        tagsProp &&
        typeof tagsProp === 'object' &&
        'multi_select' in tagsProp &&
        Array.isArray((tagsProp as { multi_select: unknown[] }).multi_select)
    ) {
        return (tagsProp as { multi_select: { name: string }[] }).multi_select
            .map(t => t.name)
            .filter(Boolean);
    }
    return [];
}

function getDatabaseId(body: NotionWebhookBody): string | null {
    const parent = body.data?.parent;
    if (!parent) return null;

    if (parent.type === 'data_source_id' && parent.database_id) {
        return parent.database_id;
    }
    if (parent.type === 'database_id' && parent.database_id) {
        return parent.database_id;
    }
    return null;
}

type ContentType = 'blog' | 'bookmarks' | 'about' | 'unknown';

function resolveContentType(databaseId: string): ContentType {
    const blogDbId = process.env.NOTION_BLOG_POSTS_DATABASE_ID;
    const bookmarksDbId = process.env.NOTION_BOOKMARKS_DATABASE_ID;

    if (blogDbId && databaseId === blogDbId) return 'blog';
    if (bookmarksDbId && databaseId === bookmarksDbId) return 'bookmarks';

    // Notion sends unhyphenated IDs; env vars may use hyphenated form
    const normalize = (id: string) => id.replace(/-/g, '');
    if (blogDbId && normalize(databaseId) === normalize(blogDbId))
        return 'blog';
    if (bookmarksDbId && normalize(databaseId) === normalize(bookmarksDbId))
        return 'bookmarks';

    return 'unknown';
}

function getAboutInvalidationTags(): string[] {
    return ['about-page', 'about-page-metadata'];
}

function getBlogWarmUrls(slug: string | null, postTags: string[]): string[] {
    const urls: string[] = ['/', '/blog'];
    if (slug) urls.push(`/blog/posts/${slug}`);
    for (const t of postTags) urls.push(`/blog/tag/${encodeURIComponent(t)}`);
    return urls;
}

function getBookmarkWarmUrls(postTags: string[]): string[] {
    const urls: string[] = ['/bookmarks'];
    for (const t of postTags)
        urls.push(`/bookmarks/tag/${encodeURIComponent(t)}`);
    return urls;
}

function getAboutWarmUrls(): string[] {
    return ['/about'];
}

function getBookmarkInvalidationTags(postTags?: string[]): string[] {
    const tags = [
        'bookmarks-page',
        'bookmarks-page-metadata',
        'sidecar-recent-bookmarks',
    ];
    if (postTags?.length) {
        for (const t of postTags) {
            tags.push(`bookmarks-tag-page-${t}`);
        }
    }
    return tags;
}

export async function POST(request: NextRequest) {
    const secret = request.nextUrl.searchParams.get('secret');
    if (secret !== process.env.REVALIDATION_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let body: NotionWebhookBody;
    try {
        body = (await request.json()) as NotionWebhookBody;
    } catch {
        return NextResponse.json(
            { error: 'Invalid JSON body' },
            { status: 400 },
        );
    }

    const data = body.data;
    if (!data || data.object !== 'page') {
        return NextResponse.json(
            { error: 'Expected data.object to be "page"' },
            { status: 400 },
        );
    }

    // Skip trashed or archived pages
    if (data.in_trash || data.is_archived) {
        return NextResponse.json({
            skipped: true,
            reason: 'Page is trashed or archived',
        });
    }

    const databaseId = getDatabaseId(body);
    if (!databaseId) {
        return NextResponse.json(
            { error: 'Could not determine parent database' },
            { status: 400 },
        );
    }

    const contentType = resolveContentType(databaseId);
    const properties = data.properties ?? {};
    let tags: string[] = [];
    let warmUrls: string[] = [];

    switch (contentType) {
        case 'blog': {
            const slug = getSlugFromProperties(properties);
            const postTags = getTagsFromProperties(properties);
            if (slug) {
                tags = getBlogPostInvalidationTags(slug, postTags);
            } else {
                // No slug — invalidate blog index surfaces only
                tags = [
                    ...getBlogPostInvalidationTags('__unknown__').filter(
                        t =>
                            !t.startsWith('blog-post-page-') &&
                            !t.startsWith('blog-post-metadata-'),
                    ),
                    ...postTags.flatMap(t => [
                        `blog-tag-page-${t}`,
                        `blog-tag-metadata-${t}`,
                    ]),
                ];
            }
            tags.push('sidecar-recent-posts');
            warmUrls = getBlogWarmUrls(slug, postTags);
            break;
        }
        case 'bookmarks': {
            const postTags = getTagsFromProperties(properties);
            tags = getBookmarkInvalidationTags(postTags);
            warmUrls = getBookmarkWarmUrls(postTags);
            break;
        }
        case 'about': {
            tags = getAboutInvalidationTags();
            warmUrls = getAboutWarmUrls();
            break;
        }
        default: {
            return NextResponse.json(
                {
                    error: 'Unrecognized database',
                    databaseId,
                },
                { status: 400 },
            );
        }
    }

    for (const tag of tags) {
        revalidateTag(tag, { expire: 0 });
    }

    // Fire-and-forget: warm the cache by fetching affected pages
    warmCache(warmUrls);

    return NextResponse.json({
        revalidated: true,
        contentType,
        tags,
        warmUrls,
    });
}
