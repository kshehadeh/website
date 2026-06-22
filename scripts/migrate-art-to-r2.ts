#!/usr/bin/env bun
/**
 * One-time migration: uploads existing local artwork from public/images/art/
 * to R2 at sketchbook/ and saves the manifest to R2 at sketchbook/manifest.json.
 *
 * Usage: bun scripts/migrate-art-to-r2.ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { uploadBufferToR2 } from '../lib/bucket';
import type { ArtManifest } from '../lib/art';

const PROJECT_ROOT = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '..',
);
const ART_DIR = path.join(PROJECT_ROOT, 'public', 'images', 'art');
const MANIFEST_PATH = path.join(ART_DIR, 'manifest.json');

async function main() {
    console.log('=== Migrate Art to R2 ===\n');

    if (!process.env.R2_BUCKET_NAME) {
        console.error('R2_BUCKET_NAME not set');
        process.exit(1);
    }

    const raw = fs.readFileSync(MANIFEST_PATH, 'utf-8');
    const manifest: ArtManifest = JSON.parse(raw);
    manifest.pages.sort((a, b) => a.position - b.position);

    let uploaded = 0;
    let failed = 0;

    for (const page of manifest.pages) {
        const filePath = path.join(ART_DIR, page.filename);
        if (!fs.existsSync(filePath)) {
            console.warn(`  ⚠  File not found: ${page.filename} — skipping`);
            failed++;
            continue;
        }

        const ext = path.extname(page.filename).toLowerCase();
        const contentTypeMap: Record<string, string> = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.webp': 'image/webp',
            '.gif': 'image/gif',
        };
        const contentType = contentTypeMap[ext] ?? 'image/jpeg';

        const buffer = fs.readFileSync(filePath);
        const key = `sketchbook/${page.filename}`;

        process.stdout.write(`  Uploading ${page.filename}...`);
        const url = await uploadBufferToR2(buffer, key, contentType);
        if (url) {
            console.log(` ✓  ${url}`);
            uploaded++;
        } else {
            console.log(' ✗  failed');
            failed++;
        }
    }

    // Upload manifest
    const manifestJson = JSON.stringify(manifest, null, 2) + '\n';
    process.stdout.write('\n  Uploading manifest...');
    const manifestUrl = await uploadBufferToR2(
        Buffer.from(manifestJson),
        'sketchbook/manifest.json',
        'application/json',
    );
    if (manifestUrl) {
        console.log(` ✓  ${manifestUrl}`);
    } else {
        console.log(' ✗  failed');
    }

    console.log(`\n=== Done: ${uploaded} uploaded, ${failed} failed ===`);
}

main();
