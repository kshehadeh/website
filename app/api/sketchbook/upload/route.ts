import { NextRequest, NextResponse } from 'next/server';
import { cleanImageWithAI, stripRotationMetadata } from '@/lib/art-cleanup';
import { uploadBufferToR2 } from '@/lib/bucket';
import {
    getSketchbookManifest,
    saveSketchbookManifest,
    insertPage,
    nextPosition,
    toUrlSafeFilename,
    titleFromFilename,
} from '@/lib/sketchbook';

const SUPPORTED_TYPES: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
};

function readImageDimensions(
    buffer: Buffer,
): { width: number; height: number } | null {
    const PNG_MAGIC = [0x89, 0x50, 0x4e, 0x47];
    const JPEG_MAGIC = [0xff, 0xd8];

    if (PNG_MAGIC.every((b, i) => buffer[i] === b)) {
        return {
            width: buffer.readUInt32BE(16),
            height: buffer.readUInt32BE(20),
        };
    }

    if (JPEG_MAGIC.every((b, i) => buffer[i] === b)) {
        let i = 2;
        while (i < buffer.length - 9) {
            if (buffer[i] !== 0xff) {
                i++;
                continue;
            }
            let marker = buffer[i + 1];
            while (marker === 0xff && i + 1 < buffer.length) {
                i++;
                marker = buffer[i + 1];
            }
            if (
                marker >= 0xc0 &&
                marker <= 0xcf &&
                marker !== 0xc4 &&
                marker !== 0xc8 &&
                marker !== 0xcc
            ) {
                return {
                    height: buffer.readUInt16BE(i + 5),
                    width: buffer.readUInt16BE(i + 7),
                };
            }
            if (
                marker === 0xd8 ||
                marker === 0xd9 ||
                (marker >= 0xd0 && marker <= 0xd7)
            ) {
                i += 2;
                continue;
            }
            const len = buffer.readUInt16BE(i + 2);
            i += 2 + len;
        }
    }

    return null;
}

export async function POST(request: NextRequest) {
    const secret = process.env.SKETCHBOOK_UPLOAD_SECRET;
    const auth = request.headers.get('authorization');
    if (!secret || auth !== `Bearer ${secret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let formData: FormData;
    try {
        formData = await request.formData();
    } catch {
        return NextResponse.json(
            { error: 'Invalid form data' },
            { status: 400 },
        );
    }

    const file = formData.get('file') as File | null;
    if (!file)
        return NextResponse.json({ error: 'Missing file' }, { status: 400 });

    const contentType = file.type;
    const ext = SUPPORTED_TYPES[contentType];
    if (!ext) {
        return NextResponse.json(
            { error: `Unsupported file type: ${contentType}` },
            { status: 400 },
        );
    }

    const titleInput = (formData.get('title') as string | null)?.trim();
    const positionInput = formData.get('position') as string | null;

    const derivedTitle = titleInput || titleFromFilename(file.name);
    const filename = toUrlSafeFilename(derivedTitle, ext);

    const rawBuffer = Buffer.from(await file.arrayBuffer());

    const cleaned = await cleanImageWithAI(rawBuffer);
    const finalBuffer = cleaned ?? (await stripRotationMetadata(rawBuffer));

    const r2Key = `sketchbook/${filename}`;
    const url = await uploadBufferToR2(finalBuffer, r2Key, contentType);
    if (!url) {
        return NextResponse.json(
            { error: 'Upload to R2 failed' },
            { status: 500 },
        );
    }

    const manifest = await getSketchbookManifest({ fresh: true });
    const position = positionInput
        ? parseInt(positionInput, 10)
        : nextPosition(manifest);
    const dims = readImageDimensions(finalBuffer);

    const page = {
        position: isNaN(position) ? nextPosition(manifest) : position,
        title: derivedTitle,
        filename,
        ...(dims ?? {}),
    };

    insertPage(manifest, page);
    await saveSketchbookManifest(manifest);

    return NextResponse.json({ success: true, url, page });
}
