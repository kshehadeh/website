import fs from 'fs';
import path from 'path';

export type ArtPage = {
    position: number;
    title: string;
    filename: string;
    width?: number;
    height?: number;
    version?: number;
};

export type ArtManifest = {
    pages: ArtPage[];
};

function readImageSize(
    filePath: string,
): { width: number; height: number } | null {
    const PNG_MAGIC = [0x89, 0x50, 0x4e, 0x47];
    const JPEG_MAGIC = [0xff, 0xd8];
    let fd: number | null = null;
    try {
        fd = fs.openSync(filePath, 'r');
        const head = Buffer.alloc(262144);
        const bytesRead = fs.readSync(fd, head, 0, head.length, 0);
        const buf = head.subarray(0, bytesRead);

        if (PNG_MAGIC.every((b, i) => buf[i] === b)) {
            return {
                width: buf.readUInt32BE(16),
                height: buf.readUInt32BE(20),
            };
        }

        if (JPEG_MAGIC.every((b, i) => buf[i] === b)) {
            let i = 2;
            while (i < buf.length - 9) {
                if (buf[i] !== 0xff) {
                    i += 1;
                    continue;
                }
                let marker = buf[i + 1];
                while (marker === 0xff && i + 1 < buf.length) {
                    i += 1;
                    marker = buf[i + 1];
                }
                if (
                    marker >= 0xc0 &&
                    marker <= 0xcf &&
                    marker !== 0xc4 &&
                    marker !== 0xc8 &&
                    marker !== 0xcc
                ) {
                    return {
                        height: buf.readUInt16BE(i + 5),
                        width: buf.readUInt16BE(i + 7),
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
                const len = buf.readUInt16BE(i + 2);
                i += 2 + len;
            }
        }
    } catch {
        return null;
    } finally {
        if (fd !== null) fs.closeSync(fd);
    }
    return null;
}

export function getArtManifest(): ArtManifest {
    const artDir = path.join(process.cwd(), 'public', 'images', 'art');
    const manifestPath = path.join(artDir, 'manifest.json');
    const raw = fs.readFileSync(manifestPath, 'utf-8');
    const manifest: ArtManifest = JSON.parse(raw);
    manifest.pages.sort((a, b) => a.position - b.position);
    for (const page of manifest.pages) {
        const filePath = path.join(artDir, page.filename);
        const size = readImageSize(filePath);
        if (size) {
            page.width = size.width;
            page.height = size.height;
        }
        try {
            page.version = Math.floor(fs.statSync(filePath).mtimeMs);
        } catch {
            page.version = 0;
        }
    }
    return manifest;
}

export function getArtImagePath(filename: string): string {
    return `/images/art/${filename}`;
}
