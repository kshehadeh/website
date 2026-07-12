import { NextRequest, NextResponse } from 'next/server';
import { getStoredTokens } from '@/lib/google-photos';

function checkAuth(request: NextRequest) {
    const secret = process.env.SKETCHBOOK_UPLOAD_SECRET;
    return (
        secret && request.headers.get('authorization') === `Bearer ${secret}`
    );
}

// GET /api/auth/google/status — check if Google Photos is connected
export async function GET(request: NextRequest) {
    if (!checkAuth(request))
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const tokens = await getStoredTokens();
    return NextResponse.json({ connected: tokens !== null });
}
