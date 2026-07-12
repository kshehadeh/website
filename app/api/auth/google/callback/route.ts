import { NextRequest, NextResponse } from 'next/server';
import { completeOAuthConnection, verifyOAuthState } from '@/lib/google-photos';

function getRedirectUri(request: NextRequest): string {
    const proto = request.headers.get('x-forwarded-proto') || 'https';
    const host =
        request.headers.get('x-forwarded-host') ||
        request.headers.get('host') ||
        new URL(request.url).host;
    return `${proto}://${host}/api/auth/google/callback`;
}

// GET /api/auth/google/callback?code=xxx&state=xxx
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    const uploadUrl = '/sketchbook/upload';

    if (error) {
        return NextResponse.redirect(
            new URL(
                `${uploadUrl}?google_error=${encodeURIComponent(error)}`,
                request.url,
            ),
        );
    }

    if (!code || !state) {
        return NextResponse.redirect(
            new URL(
                `${uploadUrl}?google_error=missing_code_or_state`,
                request.url,
            ),
        );
    }

    const valid = await verifyOAuthState(state);
    if (!valid) {
        return NextResponse.redirect(
            new URL(`${uploadUrl}?google_error=invalid_state`, request.url),
        );
    }

    const redirectUri = getRedirectUri(request);

    try {
        await completeOAuthConnection(code, redirectUri);
        return NextResponse.redirect(
            new URL(`${uploadUrl}?google_connected=1`, request.url),
        );
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return NextResponse.redirect(
            new URL(
                `${uploadUrl}?google_error=${encodeURIComponent(message)}`,
                request.url,
            ),
        );
    }
}
