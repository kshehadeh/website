import { NextRequest, NextResponse } from 'next/server';
import { clearStoredTokens } from '@/lib/google-photos';

function checkAuth(request: NextRequest) {
    const secret = process.env.SKETCHBOOK_UPLOAD_SECRET;
    return (
        secret && request.headers.get('authorization') === `Bearer ${secret}`
    );
}

// POST /api/auth/google/disconnect — remove stored Google Photos tokens
export async function POST(request: NextRequest) {
    if (!checkAuth(request))
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await clearStoredTokens();
    return NextResponse.json({ success: true });
}
