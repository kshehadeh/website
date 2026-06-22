import { createJimp } from '@jimp/core';
import { defaultFormats, defaultPlugins } from 'jimp';
import webp from '@jimp/wasm-webp';
import jo from 'jpeg-autorotate';

const Jimp = createJimp({
    formats: [...defaultFormats, webp],
    plugins: defaultPlugins,
});

export type JimpInstance = Awaited<ReturnType<typeof Jimp.read>>;

const SUPPORTED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
] as const;

type SupportedMimeType = (typeof SUPPORTED_MIME_TYPES)[number];

function detectMimeType(buffer: Buffer): SupportedMimeType {
    if (buffer[0] === 0x89 && buffer[1] === 0x50) return 'image/png';
    if (buffer[0] === 0xff && buffer[1] === 0xd8) return 'image/jpeg';
    if (buffer[0] === 0x52 && buffer[1] === 0x49) return 'image/webp';
    if (buffer[0] === 0x47 && buffer[1] === 0x49) return 'image/gif';
    return 'image/jpeg';
}

async function normalizeJpeg(buffer: Buffer): Promise<Buffer> {
    try {
        const { buffer: rotated } = await jo.rotate(buffer, { quality: 100 });
        return rotated;
    } catch (err) {
        const code = (err as { code?: string }).code;
        if (
            code === jo.errors.no_orientation ||
            code === jo.errors.correct_orientation ||
            code === jo.errors.unknown_orientation
        ) {
            return buffer;
        }
        throw err;
    }
}

export async function normalizeImage(buffer: Buffer): Promise<Buffer> {
    const mimeType = detectMimeType(buffer);
    if (mimeType === 'image/jpeg') {
        return normalizeJpeg(buffer);
    }
    const image = await Jimp.read(buffer);
    return image.getBuffer(mimeType);
}

export async function loadImage(buffer: Buffer): Promise<JimpInstance> {
    const mimeType = detectMimeType(buffer);
    if (mimeType === 'image/jpeg') {
        const normalized = await normalizeJpeg(buffer);
        return Jimp.read(normalized);
    }
    return Jimp.read(buffer);
}

export async function toBuffer(
    image: JimpInstance,
    mimeType: string,
): Promise<Buffer> {
    const safeMime = SUPPORTED_MIME_TYPES.includes(
        mimeType as SupportedMimeType,
    )
        ? (mimeType as SupportedMimeType)
        : 'image/jpeg';
    return image.getBuffer(safeMime);
}
