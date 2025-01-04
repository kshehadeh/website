import { revalidatePath } from 'next/cache';

export async function GET(
    req: Request,
    props: { params: Promise<{ path: string[] }> },
) {
    const params = await props.params;

    const { path } = params;

    const query = new URLSearchParams(req.url.split('?')[1] || '');
    if (query.get('secret') !== process.env.REVALIDATION_SECRET) {
        return new Response('Unauthorized', { status: 401 });
    }

    const pathToRevalidate = `/${path.join('/')}`;
    revalidatePath(pathToRevalidate);

    return new Response(
        JSON.stringify({ revalidated: true, path: pathToRevalidate }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
}
