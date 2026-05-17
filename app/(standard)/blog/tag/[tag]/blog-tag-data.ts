import { getBlogPostsByTag } from '@/lib/blog';
import type { BlogPostBrief } from '@/lib/blog';
import { BLOG_CACHE_LIFE } from '@/lib/blog-cache-tags';
import { cacheLife, cacheTag } from 'next/cache';

function normalizeTag(tag: string): string {
    return decodeURIComponent(tag);
}

export function blogTagPageTag(tag: string): string {
    return `blog-tag-page-${normalizeTag(tag)}`;
}

export async function loadCachedBlogPostsByTag(
    tag: string,
): Promise<BlogPostBrief[]> {
    'use cache: remote';
    const normalized = normalizeTag(tag);
    cacheLife(BLOG_CACHE_LIFE);
    cacheTag(blogTagPageTag(normalized));
    return getBlogPostsByTag([normalized]);
}
