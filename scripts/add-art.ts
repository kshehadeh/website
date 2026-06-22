#!/usr/bin/env bun
/**
 * Adds artwork images to the sketchbook from a single file or an entire folder.
 *
 * For a single file, prompts for title, position, and filename.
 * For a folder, every supported image is processed automatically using the filename as
 * the title and the next available position.
 *
 * For each image:
 *   1. Cleans up the image via the Vercel AI Gateway (removes shadows, fixes perspective/rotation)
 *   2. Copies the result into public/images/art/
 *   3. Updates public/images/art/manifest.json
 *
 * Usage: bun scripts/add-art.ts
 *
 * Optional env var: AI_GATEWAY_API_KEY — if absent, cleanup is skipped and the original image is used.
 * Optional env var: AI_GATEWAY_IMAGE_MODEL — defaults to google/gemini-3.1-flash-image-preview.
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { generateText } from 'ai';
import { uploadBufferToR2, downloadFromR2 } from '../lib/bucket';
import { stripRotationMetadata } from '../lib/art-cleanup';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ArtPage = {
    position: number;
    title: string;
    filename: string;
};

type ArtManifest = {
    pages: ArtPage[];
};

type AddImageOptions = {
    useDefaults?: boolean;
};

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

const R2_MANIFEST_KEY = 'sketchbook/manifest.json';

// ---------------------------------------------------------------------------
// Prompt helpers
// ---------------------------------------------------------------------------

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function ask(question: string): Promise<string> {
    return new Promise(resolve =>
        rl.question(question, answer => resolve(answer.trim())),
    );
}

async function askWithDefault(
    question: string,
    defaultValue: string,
): Promise<string> {
    const answer = await ask(`${question} [${defaultValue}]: `);
    return answer || defaultValue;
}

// ---------------------------------------------------------------------------
// Manifest helpers
// ---------------------------------------------------------------------------

async function readManifest(): Promise<ArtManifest> {
    const buf = await downloadFromR2(R2_MANIFEST_KEY);
    if (!buf) return { pages: [] };
    const manifest: ArtManifest = JSON.parse(buf.toString('utf-8'));
    manifest.pages.sort((a, b) => a.position - b.position);
    return manifest;
}

async function writeManifest(manifest: ArtManifest): Promise<void> {
    manifest.pages.sort((a, b) => a.position - b.position);
    const json = JSON.stringify(manifest, null, 2) + '\n';
    await uploadBufferToR2(
        Buffer.from(json),
        R2_MANIFEST_KEY,
        'application/json',
    );
}

function insertPage(manifest: ArtManifest, page: ArtPage): void {
    const conflict = manifest.pages.find(p => p.position === page.position);
    if (conflict) {
        for (const p of manifest.pages) {
            if (p.position >= page.position) p.position += 1;
        }
    }
    manifest.pages.push(page);
}

function nextPosition(manifest: ArtManifest): number {
    return manifest.pages.length === 0
        ? 1
        : Math.max(...manifest.pages.map(p => p.position)) + 1;
}

// ---------------------------------------------------------------------------
// Filename helpers
// ---------------------------------------------------------------------------

function toUrlSafeFilename(name: string, ext: string): string {
    return (
        name
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9\-]/g, '') + ext
    );
}

function titleFromFilename(filename: string): string {
    const base = path.basename(filename, path.extname(filename));
    return base.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

const SUPPORTED_EXTS = new Set([
    '.jpg',
    '.jpeg',
    '.png',
    '.webp',
    '.gif',
    '.svg',
]);

function isDirectory(sourcePath: string): boolean {
    return fs.existsSync(sourcePath) && fs.statSync(sourcePath).isDirectory();
}

function listImageFiles(folderPath: string): string[] {
    return fs
        .readdirSync(folderPath)
        .map(entry => path.join(folderPath, entry))
        .filter(entryPath => {
            if (!fs.statSync(entryPath).isFile()) return false;
            const ext = path.extname(entryPath).toLowerCase();
            return SUPPORTED_EXTS.has(ext);
        })
        .sort();
}

// ---------------------------------------------------------------------------
// Vercel AI Gateway image cleanup
// ---------------------------------------------------------------------------

const CLEANUP_PROMPT = `Clean up this photograph of an artwork. Perform the following corrections:
- Remove cast shadows caused by lighting or the camera angle
- Correct perspective distortion from the photo not being taken directly straight-on in front of the artwork (fix keystone/trapezoidal distortion so the artwork appears as a flat, head-on view)
- Straighten and correct any rotation so the artwork is level and properly oriented
- Normalize the background color: if the background appears patchy, uneven, or in shadow but is clearly meant to be a plain white paper/canvas surface, make it a uniform pure white. Be sensitive to the true background color — only whiten it if it should be white; if the background is intentionally off-white, colored, or part of the artwork, leave it unchanged
- Preserve all original artwork content, colors, and details — only fix the photographic artifacts
Return only the corrected image with no background or border added.`;

const DEFAULT_IMAGE_MODEL = 'google/gemini-3.1-flash-image-preview';

async function cleanupWithAiGateway(
    imageBuffer: Buffer,
): Promise<Buffer | null> {
    const apiKey = process.env.AI_GATEWAY_API_KEY;
    if (!apiKey) {
        console.log(
            '  ⚠  AI_GATEWAY_API_KEY not set — skipping cleanup, using original image.',
        );
        return null;
    }

    const model = process.env.AI_GATEWAY_IMAGE_MODEL || DEFAULT_IMAGE_MODEL;

    console.log('  Calling Vercel AI Gateway for image cleanup...');

    let result;
    try {
        result = await generateText({
            model,
            messages: [
                {
                    role: 'user',
                    content: [
                        { type: 'text', text: CLEANUP_PROMPT },
                        { type: 'image', image: imageBuffer },
                    ],
                },
            ],
        });
    } catch (err) {
        console.warn(
            `  ⚠  Vercel AI Gateway request failed: ${err} — using original image.`,
        );
        return null;
    }

    const imageFiles = result.files.filter(f =>
        f.mediaType?.startsWith('image/'),
    );
    if (imageFiles.length === 0) {
        console.warn(
            '  ⚠  Vercel AI Gateway returned no image — using original image.',
        );
        return null;
    }

    console.log('  ✓  Cleanup complete.');
    return Buffer.from(imageFiles[0].uint8Array);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function addImage(
    manifest: ArtManifest,
    sourcePath: string,
    options: AddImageOptions = {},
): Promise<ArtPage | null> {
    const ext = path.extname(sourcePath).toLowerCase();
    if (!SUPPORTED_EXTS.has(ext)) {
        if (options.useDefaults) {
            console.warn(
                `  ⚠  Unsupported format: ${ext} — skipping ${path.basename(sourcePath)}.`,
            );
            return null;
        }
        throw new Error(
            `Unsupported format: ${ext}. Supported: ${[...SUPPORTED_EXTS].join(', ')}`,
        );
    }

    const defaultTitle = titleFromFilename(sourcePath);
    let title: string;
    let position: number;
    let filename: string;

    if (options.useDefaults) {
        title = defaultTitle;
        position = nextPosition(manifest);
        filename = toUrlSafeFilename(defaultTitle, ext);
    } else {
        title = await askWithDefault('Title', defaultTitle);

        const defaultPosition = nextPosition(manifest);
        const positionRaw = await askWithDefault(
            'Position',
            String(defaultPosition),
        );
        position = parseInt(positionRaw, 10);
        if (isNaN(position) || position < 1)
            throw new Error(`Invalid position: ${positionRaw}`);

        const defaultFilename = toUrlSafeFilename(title, ext);
        filename = await askWithDefault('Filename', defaultFilename);
    }

    const extToMime: Record<string, string> = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.webp': 'image/webp',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
    };
    const contentType = extToMime[ext] ?? 'image/jpeg';
    const rawBuffer = fs.readFileSync(sourcePath);
    const cleaned = await cleanupWithAiGateway(rawBuffer);
    const finalBuffer = cleaned ?? (await stripRotationMetadata(rawBuffer));

    const r2Key = `sketchbook/${filename}`;
    const url = await uploadBufferToR2(finalBuffer, r2Key, contentType);
    if (!url) throw new Error(`Failed to upload ${filename} to R2`);

    console.log(`  ✓  Uploaded to ${url}`);

    return { position, title, filename };
}

async function main() {
    console.log('=== Add Art to Sketchbook ===\n');

    const manifest = await readManifest();

    const sourcePath = await ask('Source image path or folder: ');
    if (!fs.existsSync(sourcePath)) {
        console.error(`Path not found: ${sourcePath}`);
        process.exit(1);
    }

    const added: ArtPage[] = [];

    if (isDirectory(sourcePath)) {
        const imageFiles = listImageFiles(sourcePath);
        if (imageFiles.length === 0) {
            console.error('No supported images found in folder.');
            process.exit(1);
        }

        console.log(
            `\nFound ${imageFiles.length} image(s). Processing with defaults...`,
        );

        for (let i = 0; i < imageFiles.length; i++) {
            console.log(`\n--- Image ${i + 1} of ${imageFiles.length} ---`);
            try {
                const page = await addImage(manifest, imageFiles[i], {
                    useDefaults: true,
                });
                if (page) {
                    insertPage(manifest, page);
                    added.push(page);
                }
            } catch (err) {
                console.error(
                    `  ✗  ${err instanceof Error ? err.message : err}`,
                );
            }
        }
    } else {
        try {
            const page = await addImage(manifest, sourcePath);
            if (page) {
                insertPage(manifest, page);
                added.push(page);
            }
        } catch (err) {
            console.error(`  ✗  ${err instanceof Error ? err.message : err}`);
            process.exit(1);
        }
    }

    await writeManifest(manifest);
    rl.close();

    console.log('\n=== Done ===');
    for (const p of added) {
        console.log(`  Position ${p.position}: "${p.title}" → ${p.filename}`);
    }
}

main();
