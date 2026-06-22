import { NextRequest, NextResponse } from 'next/server';
import {
    CopyObjectCommand,
    DeleteObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';
import {
    getSketchbookManifest,
    saveSketchbookManifest,
    toUrlSafeFilename,
} from '@/lib/sketchbook';

function createR2Client() {
    return new S3Client({
        endpoint: process.env.R2_ENDPOINT as string,
        region: 'us-east-1',
        credentials: {
            accessKeyId: process.env.R2_AWS_ACCESS_KEY_ID as string,
            secretAccessKey: process.env.R2_AWS_SECRET_ACCESS_KEY as string,
        },
        forcePathStyle: true,
    });
}

function checkAuth(request: NextRequest) {
    const secret = process.env.SKETCHBOOK_UPLOAD_SECRET;
    return (
        secret && request.headers.get('authorization') === `Bearer ${secret}`
    );
}

// DELETE /api/sketchbook/item?filename=foo.jpg
export async function DELETE(request: NextRequest) {
    if (!checkAuth(request))
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const filename = request.nextUrl.searchParams.get('filename');
    if (!filename)
        return NextResponse.json(
            { error: 'Missing filename' },
            { status: 400 },
        );

    const manifest = await getSketchbookManifest({ fresh: true });
    const idx = manifest.pages.findIndex(p => p.filename === filename);
    if (idx === -1)
        return NextResponse.json({ error: 'Not found' }, { status: 404 });

    try {
        const client = createR2Client();
        await client.send(
            new DeleteObjectCommand({
                Bucket: process.env.R2_BUCKET_NAME,
                Key: `sketchbook/${filename}`,
            }),
        );
    } catch (err) {
        return NextResponse.json(
            { error: `R2 delete failed: ${err}` },
            { status: 500 },
        );
    }

    manifest.pages.splice(idx, 1);
    await saveSketchbookManifest(manifest);

    return NextResponse.json({ success: true });
}

// PATCH /api/sketchbook/item  body: { filename, title }
export async function PATCH(request: NextRequest) {
    if (!checkAuth(request))
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let body: { filename?: string; title?: string };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const { filename, title } = body;
    if (!filename || !title?.trim()) {
        return NextResponse.json(
            { error: 'Missing filename or title' },
            { status: 400 },
        );
    }

    const manifest = await getSketchbookManifest({ fresh: true });
    const page = manifest.pages.find(p => p.filename === filename);
    if (!page)
        return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const ext = filename.slice(filename.lastIndexOf('.'));
    const newFilename = toUrlSafeFilename(title.trim(), ext);

    if (newFilename !== filename) {
        try {
            const client = createR2Client();
            const bucket = process.env.R2_BUCKET_NAME;
            await client.send(
                new CopyObjectCommand({
                    Bucket: bucket,
                    CopySource: `${bucket}/sketchbook/${filename}`,
                    Key: `sketchbook/${newFilename}`,
                }),
            );
            await client.send(
                new DeleteObjectCommand({
                    Bucket: bucket,
                    Key: `sketchbook/${filename}`,
                }),
            );
        } catch (err) {
            return NextResponse.json(
                { error: `R2 rename failed: ${err}` },
                { status: 500 },
            );
        }
        page.filename = newFilename;
    }

    page.title = title.trim();
    await saveSketchbookManifest(manifest);

    return NextResponse.json({ success: true, page });
}
