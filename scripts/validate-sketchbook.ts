#!/usr/bin/env bun
/**
 * Validates the sketchbook manifest against R2 and removes entries whose
 * image files are missing.  Prints a summary and writes the cleaned manifest
 * back to R2 (unless --dry-run is passed).
 *
 * Usage:
 *   bun scripts/validate-sketchbook.ts
 *   bun scripts/validate-sketchbook.ts --dry-run
 */

import { downloadFromR2, uploadBufferToR2 } from '../lib/bucket';
import { getSketchbookManifest } from '../lib/sketchbook';
import type { ArtManifest } from '../lib/art';

const dryRun = process.argv.includes('--dry-run');

async function fileExistsInR2(filename: string): Promise<boolean> {
    const buf = await downloadFromR2(`sketchbook/${filename}`);
    return buf !== null && buf.length > 0;
}

async function main() {
    console.log(
        `=== Validate Sketchbook Manifest ${dryRun ? '(dry run)' : ''} ===\n`,
    );

    const manifest = await getSketchbookManifest({ fresh: true });
    console.log(`Manifest has ${manifest.pages.length} entries.\n`);

    const keep: ArtManifest['pages'] = [];
    const pruned: string[] = [];

    for (const page of manifest.pages) {
        process.stdout.write(`  Checking ${page.filename}...`);
        const exists = await fileExistsInR2(page.filename);
        if (exists) {
            console.log(' ✓');
            keep.push(page);
        } else {
            console.log(' ✗  missing in R2 — will prune');
            pruned.push(page.filename);
        }
    }

    console.log(`\nResult: ${keep.length} valid, ${pruned.length} to prune.`);

    if (pruned.length === 0) {
        console.log('Manifest is clean — nothing to do.');
        return;
    }

    if (dryRun) {
        console.log('\n--dry-run: no changes written.');
        return;
    }

    const cleaned: ArtManifest = { pages: keep };
    cleaned.pages.sort((a, b) => a.position - b.position);
    const json = JSON.stringify(cleaned, null, 2) + '\n';
    await uploadBufferToR2(
        Buffer.from(json),
        'sketchbook/manifest.json',
        'application/json',
    );
    console.log('\n✓  Cleaned manifest saved to R2.');
}

main();
