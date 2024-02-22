import { getBlogPosts } from '@/lib/blog';
import { isDateProperty, isRichTextProperty } from '@/lib/notion';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const posts = await getBlogPosts({
        sortBy: {
            property: 'Posted',
            direction: 'descending',
        },
    });

    const postNodes = posts
        .filter((post): post is PageObjectResponse => !!post)
        .map(post => {
            const slug = isRichTextProperty(post.properties.Slug) ? post.properties.Slug.rich_text[0].plain_text : '';
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
    })

    postNodes.push({
        url: 'https://karim.cloud/about',
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.5,
    })

    postNodes.push({
        url: 'https://karim.cloud',
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.5,
    })

    postNodes.push({
        url: 'https://karim.cloud/blog',
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 1.0,
    })

    return postNodes;
}
