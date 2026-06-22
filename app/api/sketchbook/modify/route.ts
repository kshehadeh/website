import { NextRequest, NextResponse } from 'next/server';
import { loadImage, toBuffer } from '@/lib/image-transform';
import {
    downloadFromR2,
    makeR2UrlFromKey,
    purgeCloudflareCache,
    uploadBufferToR2,
} from '@/lib/bucket';
import {
    getSketchbookManifest,
    saveSketchbookManifest,
} from '@/lib/sketchbook';

type Operation = 'rotate-left' | 'rotate-right' | 'mirror';

function checkAuth(request: NextRequest) {
    const secret = process.env.SKETCHBOOK_UPLOAD_SECRET;
    return (
        secret && request.headers.get('authorization') === `Bearer ${secret}`
    );
}

function extToMime(filename: string): string {
    const ext = filename.slice(filename.lastIndexOf('.')).toLowerCase();
    const map: Record<string, string> = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.webp': 'image/webp',
        '.gif': 'image/gif',
    };
    return map[ext] ?? 'image/jpeg';
}

// POST /api/sketchbook/modify  body: { filename, operation }
export async function POST(request: NextRequest) {
    if (!checkAuth(request))
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let body: { filename?: string; operation?: Operation };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const { filename, operation } = body;
    if (!filename || !operation) {
        return NextResponse.json(
            { error: 'Missing filename or operation' },
            { status: 400 },
        );
    }

    const original = await downloadFromR2(`sketchbook/${filename}`);
    if (!original)
        return NextResponse.json(
            { error: 'File not found in R2' },
            { status: 404 },
        );

    // Load the image and apply EXIF orientation first so the subsequent user
    // rotation starts from the correct visual orientation. The normalization
    // step also strips all metadata (including EXIF).
    const image = await loadImage(original);

    switch (operation) {
        case 'rotate-left':
            image.rotate(90);
            break;
        case 'rotate-right':
            image.rotate(-90);
            break;
        case 'mirror':
            image.flip({ horizontal: true, vertical: false });
            break;
        default:
            return NextResponse.json(
                { error: `Unknown operation: ${operation}` },
                { status: 400 },
            );
    }

    const contentType = extToMime(filename);
    const modified = await toBuffer(image, contentType);
    const r2Key = `sketchbook/${filename}`;
    const url = await uploadBufferToR2(modified, r2Key, contentType);
    if (!url)
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });

    await purgeCloudflareCache([makeR2UrlFromKey(r2Key)]);

    const version = Date.now();
    const manifest = await getSketchbookManifest({ fresh: true });
    const page = manifest.pages.find(p => p.filename === filename);
    if (page) {
        page.version = version;
        await saveSketchbookManifest(manifest);
    }

    return NextResponse.json({ success: true, url, version });
}
