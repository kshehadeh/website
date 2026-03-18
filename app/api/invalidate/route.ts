import { revalidateTag } from 'next/cache';

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

export async function GET(req: Request) {
    const url = new URL(req.url);
    const secret = url.searchParams.get('secret');

    if (secret !== process.env.REVALIDATION_SECRET) {
        return new Response('Unauthorized', { status: 401 });
    }

    const tags = getTagsFromRequest(req);
    if (tags.length === 0) {
        return new Response('Missing required query parameter: tag', {
            status: 400,
        });
    }

    for (const tag of tags) {
        revalidateTag(tag, 'max');
    }

    return new Response(
        JSON.stringify({
            revalidated: true,
            tags,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
}
