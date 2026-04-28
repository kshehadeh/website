import { getBlogPostBySlug } from '@/lib/blog';
import type { BlogPostFull } from '@/lib/blog';
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
    cacheLife({ stale: 3600, revalidate: 3600 });
    cacheTag(blogPostMetadataTag(normalized));
    cacheTag(blogPostPageTag(normalized));
    return getBlogPostBySlug(normalized);
}
