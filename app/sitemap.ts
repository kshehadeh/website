import { getBlogPosts } from '@/lib/blog';
import { BLOG_SITEMAP_CACHE_TAG } from '@/lib/blog-cache-tags';
import { isDateProperty, isRichTextProperty } from '@/lib/notion';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { MetadataRoute } from 'next';
import { cacheLife, cacheTag } from 'next/cache';

async function getCachedPostsForSitemap(): Promise<PageObjectResponse[]> {
    'use cache';
    cacheLife({ stale: 3600, revalidate: 3600 });
    cacheTag(BLOG_SITEMAP_CACHE_TAG);

    const posts = await getBlogPosts({
        sortBy: {
            property: 'Posted',
            direction: 'descending',
        },
    });

    return posts.filter((post): post is PageObjectResponse => !!post);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const posts = await getCachedPostsForSitemap();

    const postNodes = posts
        .map(post => {
            const slug = isRichTextProperty(post.properties.Slug)
                ? post.properties.Slug.rich_text[0].plain_text
                : '';
            const date =
                isDateProperty(post.properties.Posted) &&
                post.properties.Posted.date
                    ? new Date(post.properties.Posted.date.start)
                    : new Date();
            return {
                url: `https://karim.cloud/blog/posts/${slug}`,
                lastModified: date,
                changeFrequency: 'weekly' as const,
                priority: 1,
            };
        })
        .sort((a, b) => a.lastModified.getTime() - b.lastModified.getTime());

    postNodes.push({
        url: 'https://karim.cloud/resume',
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.5,
    });

    postNodes.push({
        url: 'https://karim.cloud/about',
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.5,
    });

    postNodes.push({
        url: 'https://karim.cloud',
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.5,
    });

    postNodes.push({
        url: 'https://karim.cloud/blog',
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 1.0,
    });

    return postNodes;
}
