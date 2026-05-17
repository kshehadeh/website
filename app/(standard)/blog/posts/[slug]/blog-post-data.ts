import { getBlogPostBySlug } from '@/lib/blog';
import type { BlogPostFull } from '@/lib/blog';
import { BLOG_CACHE_LIFE } from '@/lib/blog-cache-tags';
import { cacheLife, cacheTag } from 'next/cache';

function normalizeSlug(slug: string): string {
    return decodeURIComponent(slug);
}

export function blogPostPageTag(slug: string): string {
    return `blog-post-page-${normalizeSlug(slug)}`;
}

export function blogPostMetadataTag(slug: string): string {
    return `blog-post-metadata-${normalizeSlug(slug)}`;
}

/**
 * Single cached data load for a post: used by both `generateMetadata` and the page
 * so Notion is not queried twice per request for the same slug.
 */
export async function loadCachedBlogPostBySlug(
    slug: string,
): Promise<BlogPostFull | undefined> {
    'use cache';
    const normalized = normalizeSlug(slug);
    // #region agent log
    console.info(
        JSON.stringify({
            sessionId: 'f75588',
            runId: 'baseline',
            hypothesisId: 'H6',
            location: 'app/(standard)/blog/posts/[slug]/blog-post-data.ts:30',
            message: 'loadCachedBlogPostBySlug cache-miss execution',
            data: { slug, normalized },
        }),
    );
    // #endregion
    cacheLife(BLOG_CACHE_LIFE);
    cacheTag(blogPostMetadataTag(normalized));
    cacheTag(blogPostPageTag(normalized));
    return getBlogPostBySlug(normalized);
}
