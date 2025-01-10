import { getBlogBrief, getBlogPosts } from '@/lib/blog';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import RSS from 'rss';

export async function GET(): Promise<Response> {
    const rss = new RSS({
        title: "Karim Shehadeh's Blog",
        description: 'Musings and Ramblings of a Human',
        site_url: 'https://karim.cloud',
        feed_url: 'https://karim.cloud/api/rss',
        image_url:
            'https://static.karim.cloud/e3f07d61-ee0e-457d-ac76-ddd0377b824d%2Fkarim-ink-1.jpeg',
    });

    const posts = await getBlogPosts({
        sortBy: {
            property: 'Posted',
            direction: 'descending',
        },
    });

    const pageObjects = posts.filter(
        (post): post is PageObjectResponse => !!post,
    );

    for (const post of pageObjects) {
        const brief = await getBlogBrief({ post, fetchAbstract: true });
        rss.item({
            title: brief.title,
            description: brief.abstract || '',
            url: `https://karim.cloud/blog/posts/${brief.slug}`,
            date: brief.date,
        });
    }

    return new Response(rss.xml(), {
        headers: {
            'Content-Type': 'application/xml',
        },
    });
}
