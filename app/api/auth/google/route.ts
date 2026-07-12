import { NextRequest, NextResponse } from 'next/server';
import { buildAuthUrl, saveOAuthState } from '@/lib/google-photos';

function checkAuth(request: NextRequest) {
    const secret = process.env.SKETCHBOOK_UPLOAD_SECRET;
    return (
        secret && request.headers.get('authorization') === `Bearer ${secret}`
    );
}

function getRedirectUri(request: NextRequest): string {
    const proto = request.headers.get('x-forwarded-proto') || 'https';
    const host =
        request.headers.get('x-forwarded-host') ||
        request.headers.get('host') ||
        new URL(request.url).host;
    return `${proto}://${host}/api/auth/google/callback`;
}

// POST /api/auth/google — initiate OAuth flow, returns the Google consent URL
export async function POST(request: NextRequest) {
    if (!checkAuth(request))
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (!process.env.GOOGLE_PHOTOS_CLIENT_ID) {
        return NextResponse.json(
            { error: 'GOOGLE_PHOTOS_CLIENT_ID not configured' },
            { status: 500 },
        );
    }

    const state = crypto.randomUUID();
    const redirectUri = getRedirectUri(request);

    try {
        await saveOAuthState(state);
    } catch {
        return NextResponse.json(
            { error: 'Failed to save OAuth state' },
            { status: 500 },
        );
    }

    const authUrl = buildAuthUrl(redirectUri, state);
    return NextResponse.json({ url: authUrl });
}
