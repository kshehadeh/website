import { NextRequest, NextResponse } from 'next/server';
import { getMirroredFileUrl } from '@/lib/bucket';

export const maxDuration = 60;

function isValidMirrorSource(source: string) {
    try {
        const url = new URL(source);
        return url.protocol === 'https:';
    } catch {
        return false;
    }
}

export async function GET(request: NextRequest) {
    const source = request.nextUrl.searchParams.get('source');
    const key = request.nextUrl.searchParams.get('key');

    if (!source || !key || !isValidMirrorSource(source)) {
        return NextResponse.json({ error: 'Invalid source or key.' }, {
            status: 400,
        });
    }

    const url = await getMirroredFileUrl(source, key);
    return NextResponse.redirect(url);
}
