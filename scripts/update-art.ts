#!/usr/bin/env bun
/**
 * Scans existing artwork images in public/images/art/ and re-cleans any that
 * still show photographic artifacts (shadows, perspective distortion, rotation,
 * patchy/off-color backgrounds).
 *
 * For each image:
 *   1. Sends the image to the Vercel AI Gateway with an assessment prompt that
 *      asks whether further cleanup is needed.
 *   2. If the AI says cleanup is needed, runs the full cleanup prompt and
 *      overwrites the image in place.
 *   3. If the AI says the image is already clean, skips it.
 *
 * Usage: bun scripts/update-art.ts
 *
 * Optional env vars:
 *   AI_GATEWAY_API_KEY       — required for any AI calls; if absent, exits early.
 *   AI_GATEWAY_IMAGE_MODEL   — model for cleanup step (defaults to google/gemini-3.1-flash-image-preview).
 *   AI_GATEWAY_TEXT_MODEL    — model for assessment step (defaults to google/gemini-2.5-flash).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateText } from 'ai';

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

const PROJECT_ROOT = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '..',
);
const ART_DIR = path.join(PROJECT_ROOT, 'public', 'images', 'art');

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SUPPORTED_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

const ASSESSMENT_PROMPT = `You are examining a photograph of an artwork that has already been through one round of cleanup. Determine whether the image still needs further cleanup. Check for the following issues:
- Cast shadows or uneven lighting across the artwork or background
- Perspective distortion (keystone/trapezoidal) indicating the photo was not taken straight-on
- Rotation that is not level
- Background that appears patchy, in shadow, or unevenly colored when it should be a plain white surface
Respond with ONLY one word: "YES" if any of these issues are present and further cleanup is needed, or "NO" if the image is already clean.`;

const CLEANUP_PROMPT = `Clean up this photograph of an artwork. Perform the following corrections:
- Remove cast shadows caused by lighting or the camera angle
- Correct perspective distortion from the photo not being taken directly straight-on in front of the artwork (fix keystone/trapezoidal distortion so the artwork appears as a flat, head-on view)
- Straighten and correct any rotation so the artwork is level and properly oriented
- Normalize the background color: if the background appears patchy, uneven, or in shadow but is clearly meant to be a plain white paper/canvas surface, make it a uniform pure white. Be sensitive to the true background color — only whiten it if it should be white; if the background is intentionally off-white, colored, or part of the artwork, leave it unchanged
- Preserve all original artwork content, colors, and details — only fix the photographic artifacts
Return only the corrected image with no background or border added.`;

const DEFAULT_IMAGE_MODEL = 'google/gemini-3.1-flash-image-preview';
const DEFAULT_TEXT_MODEL = 'google/gemini-2.5-flash';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function listImageFiles(dir: string): string[] {
    return fs
        .readdirSync(dir)
        .filter(entry => {
            const fullPath = path.join(dir, entry);
            if (!fs.statSync(fullPath).isFile()) return false;
            const ext = path.extname(entry).toLowerCase();
            return SUPPORTED_EXTS.has(ext);
        })
        .sort()
        .map(entry => path.join(dir, entry));
}

// ---------------------------------------------------------------------------
// AI Gateway calls
// ---------------------------------------------------------------------------

async function assessNeedsCleanup(filePath: string): Promise<boolean> {
    const model = process.env.AI_GATEWAY_TEXT_MODEL || DEFAULT_TEXT_MODEL;
    const imageBuffer = fs.readFileSync(filePath);

    let result;
    try {
        result = await generateText({
            model,
            messages: [
                {
                    role: 'user',
                    content: [
                        { type: 'text', text: ASSESSMENT_PROMPT },
                        { type: 'image', image: imageBuffer },
                    ],
                },
            ],
        });
    } catch (err) {
        console.warn(
            `  ⚠  Assessment request failed: ${err} — assuming cleanup needed.`,
        );
        return true;
    }

    const answer = (result.text || '').trim().toUpperCase();
    return answer.startsWith('YES');
}

async function cleanupInPlace(filePath: string): Promise<boolean> {
    const model = process.env.AI_GATEWAY_IMAGE_MODEL || DEFAULT_IMAGE_MODEL;
    const imageBuffer = fs.readFileSync(filePath);

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
            `  ⚠  Cleanup request failed: ${err} — leaving image unchanged.`,
        );
        return false;
    }

    const imageFiles = result.files.filter(f =>
        f.mediaType?.startsWith('image/'),
    );
    if (imageFiles.length === 0) {
        console.warn(
            '  ⚠  AI Gateway returned no image — leaving image unchanged.',
        );
        return false;
    }

    const tmpPath = filePath + '.tmp';
    fs.writeFileSync(tmpPath, imageFiles[0].uint8Array);
    fs.renameSync(tmpPath, filePath);
    return true;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
    const apiKey = process.env.AI_GATEWAY_API_KEY;
    if (!apiKey) {
        console.error('AI_GATEWAY_API_KEY is not set. Nothing to do.');
        process.exit(1);
    }

    console.log('=== Update Art: assess and re-clean existing images ===\n');

    const imageFiles = listImageFiles(ART_DIR);
    if (imageFiles.length === 0) {
        console.log('No supported images found in public/images/art/');
        process.exit(0);
    }

    console.log(`Found ${imageFiles.length} image(s).\n`);

    let cleanedCount = 0;
    let skippedCount = 0;
    let failedCount = 0;

    for (let i = 0; i < imageFiles.length; i++) {
        const filePath = imageFiles[i];
        const name = path.basename(filePath);
        console.log(`--- [${i + 1}/${imageFiles.length}] ${name} ---`);

        console.log('  Assessing...');
        let needsCleanup: boolean;
        try {
            needsCleanup = await assessNeedsCleanup(filePath);
        } catch (err) {
            console.error(`  ✗  Assessment error: ${err}`);
            failedCount++;
            continue;
        }

        if (!needsCleanup) {
            console.log('  ✓  Already clean — skipping.');
            skippedCount++;
            continue;
        }

        console.log('  Cleanup needed — processing...');
        const success = await cleanupInPlace(filePath);
        if (success) {
            console.log('  ✓  Cleaned in place.');
            cleanedCount++;
        } else {
            console.log('  ⚠  Cleanup failed — image left unchanged.');
            failedCount++;
        }
    }

    console.log('\n=== Done ===');
    console.log(
        `  Cleaned: ${cleanedCount}  Skipped: ${skippedCount}  Failed: ${failedCount}`,
    );
}

main();
