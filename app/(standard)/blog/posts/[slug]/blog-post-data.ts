import { getBlogPostBySlug, getBlogPostMetadataBySlug } from '@/lib/blog';
import type { BlogPostBrief, BlogPostFull } from '@/lib/blog';
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

export async function loadCachedBlogPostMetadataBySlug(
    slug: string,
): Promise<BlogPostBrief | undefined> {
    'use cache: remote';
    const normalized = normalizeSlug(slug);
    cacheLife(BLOG_CACHE_LIFE);
    cacheTag(blogPostMetadataTag(normalized));
    return getBlogPostMetadataBySlug(normalized);
}

export async function loadCachedBlogPostBySlug(
    slug: string,
): Promise<BlogPostFull | undefined> {
    'use cache: remote';
    const normalized = normalizeSlug(slug);
    cacheLife(BLOG_CACHE_LIFE);
    cacheTag(blogPostMetadataTag(normalized));
    cacheTag(blogPostPageTag(normalized));
    return getBlogPostBySlug(normalized);
}
