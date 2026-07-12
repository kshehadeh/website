/**
 * Google Photos integration helper.
 *
 * Uses the Google Photos Library API with an interactive OAuth flow.
 * The refresh token and album ID are stored in Vercel KV after the user
 * connects their Google account from the sketchbook upload page.
 *
 * Required env vars:
 *   GOOGLE_PHOTOS_CLIENT_ID     - OAuth client ID
 *   GOOGLE_PHOTOS_CLIENT_SECRET - OAuth client secret
 *   KV_REST_API_URL             - Vercel KV (auto-configured by Vercel)
 *   KV_REST_API_TOKEN           - Vercel KV (auto-configured by Vercel)
 */

import { kv } from '@vercel/kv';

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const UPLOAD_URL = 'https://photoslibrary.googleapis.com/v1/uploads';
const BATCH_CREATE_URL =
    'https://photoslibrary.googleapis.com/v1/mediaItems:batchCreate';
const ALBUMS_URL = 'https://photoslibrary.googleapis.com/v1/albums';
const AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';

export const GOOGLE_PHOTOS_SCOPES = [
    'https://www.googleapis.com/auth/photoslibrary',
    'https://www.googleapis.com/auth/photoslibrary.appendonly',
    'https://www.googleapis.com/auth/photoslibrary.readonly.appcreateddata',
];

const KV_TOKENS_KEY = 'google_photos:tokens';
const KV_STATE_KEY = 'google_photos:oauth_state';

type StoredTokens = {
    refreshToken: string;
    albumId: string;
};

export type GooglePhotosResult = { ok: true } | { ok: false; warning: string };

type OAuthCredentials = {
    clientId: string;
    clientSecret: string;
};

function getCredentials(): OAuthCredentials | null {
    const clientId = process.env.GOOGLE_PHOTOS_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_PHOTOS_CLIENT_SECRET;
    if (!clientId || !clientSecret) return null;
    return { clientId, clientSecret };
}

// ---------------------------------------------------------------------------
// Token storage (Vercel KV)
// ---------------------------------------------------------------------------

export async function getStoredTokens(): Promise<StoredTokens | null> {
    return (await kv.get<StoredTokens>(KV_TOKENS_KEY)) ?? null;
}

async function storeTokens(tokens: StoredTokens): Promise<void> {
    await kv.set(KV_TOKENS_KEY, tokens);
}

export async function clearStoredTokens(): Promise<void> {
    await kv.del(KV_TOKENS_KEY);
}

// ---------------------------------------------------------------------------
// OAuth flow
// ---------------------------------------------------------------------------

export function buildAuthUrl(redirectUri: string, state: string): string {
    const clientId = process.env.GOOGLE_PHOTOS_CLIENT_ID;
    if (!clientId) throw new Error('GOOGLE_PHOTOS_CLIENT_ID not set');

    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: GOOGLE_PHOTOS_SCOPES.join(' '),
        access_type: 'offline',
        prompt: 'consent',
        state,
    });

    return `${AUTH_URL}?${params.toString()}`;
}

export async function saveOAuthState(state: string): Promise<void> {
    await kv.set(KV_STATE_KEY, state, { ex: 300 });
}

export async function verifyOAuthState(state: string): Promise<boolean> {
    const stored = await kv.get<string>(KV_STATE_KEY);
    if (stored && stored === state) {
        await kv.del(KV_STATE_KEY);
        return true;
    }
    return false;
}

type TokenResponse = {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
};

export async function exchangeCodeForTokens(
    code: string,
    redirectUri: string,
): Promise<TokenResponse> {
    const creds = getCredentials();
    if (!creds) throw new Error('Google OAuth credentials not configured');

    const res = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            client_id: creds.clientId,
            client_secret: creds.clientSecret,
            code,
            grant_type: 'authorization_code',
            redirect_uri: redirectUri,
        }),
    });

    if (!res.ok) {
        const body = await res.text();
        throw new Error(`Token exchange failed (${res.status}): ${body}`);
    }

    return (await res.json()) as TokenResponse;
}

// ---------------------------------------------------------------------------
// Album management
// ---------------------------------------------------------------------------

type Album = {
    id: string;
    title: string;
    productUrl?: string;
};

export async function createAlbum(
    accessToken: string,
    title: string,
): Promise<Album> {
    const res = await fetch(ALBUMS_URL, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ album: { title } }),
    });

    if (!res.ok) {
        const body = await res.text();
        throw new Error(`Album creation failed (${res.status}): ${body}`);
    }

    return (await res.json()) as Album;
}

/**
 * Complete the OAuth connection: exchange code, create Sketchbook album,
 * and store tokens in KV.
 */
export async function completeOAuthConnection(
    code: string,
    redirectUri: string,
): Promise<void> {
    const tokens = await exchangeCodeForTokens(code, redirectUri);
    if (!tokens.refresh_token) {
        throw new Error('No refresh token returned from Google');
    }

    const album = await createAlbum(tokens.access_token, 'Sketchbook');

    await storeTokens({
        refreshToken: tokens.refresh_token,
        albumId: album.id,
    });
}

// ---------------------------------------------------------------------------
// Upload helpers
// ---------------------------------------------------------------------------

async function refreshAccessToken(refreshToken: string): Promise<string> {
    const creds = getCredentials();
    if (!creds) throw new Error('Google OAuth credentials not configured');

    const res = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            client_id: creds.clientId,
            client_secret: creds.clientSecret,
            refresh_token: refreshToken,
            grant_type: 'refresh_token',
        }),
    });

    if (!res.ok) {
        const body = await res.text();
        throw new Error(`Token refresh failed (${res.status}): ${body}`);
    }

    const data = (await res.json()) as { access_token: string };
    return data.access_token;
}

async function uploadRawBytes(
    accessToken: string,
    buffer: Buffer,
    contentType: string,
): Promise<string> {
    const res = await fetch(UPLOAD_URL, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/octet-stream',
            'X-Goog-Upload-Content-Type': contentType,
            'X-Goog-Upload-Protocol': 'raw',
        },
        body: new Uint8Array(buffer),
    });

    if (!res.ok) {
        const body = await res.text();
        throw new Error(`Raw upload failed (${res.status}): ${body}`);
    }

    const uploadToken = (await res.text()).trim();
    if (!uploadToken) {
        throw new Error('Raw upload returned empty upload token');
    }

    return uploadToken;
}

async function batchCreateMediaItem(
    accessToken: string,
    albumId: string,
    uploadToken: string,
    filename: string,
    description: string,
): Promise<void> {
    const res = await fetch(BATCH_CREATE_URL, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            albumId,
            newMediaItems: [
                {
                    description,
                    simpleMediaItem: { uploadToken, fileName: filename },
                },
            ],
        }),
    });

    if (!res.ok) {
        const body = await res.text();
        throw new Error(`batchCreate failed (${res.status}): ${body}`);
    }
}

/**
 * Upload an image buffer to the Google Photos Sketchbook album.
 * Returns { ok: true } on success or { ok: false, warning } on failure.
 */
export async function uploadToGooglePhotos(
    buffer: Buffer,
    filename: string,
    contentType: string,
    description: string,
): Promise<GooglePhotosResult> {
    if (!getCredentials()) {
        return {
            ok: false,
            warning: 'Google Photos not configured — skipping album copy.',
        };
    }

    const stored = await getStoredTokens();
    if (!stored) {
        return {
            ok: false,
            warning: 'Google Photos not connected — skipping album copy.',
        };
    }

    try {
        const accessToken = await refreshAccessToken(stored.refreshToken);
        const uploadToken = await uploadRawBytes(
            accessToken,
            buffer,
            contentType,
        );
        await batchCreateMediaItem(
            accessToken,
            stored.albumId,
            uploadToken,
            filename,
            description,
        );
        return { ok: true };
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return {
            ok: false,
            warning: `Google Photos upload failed: ${message}`,
        };
    }
}
