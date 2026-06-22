import { uploadBufferToR2 } from './bucket';
import type { ArtManifest, ArtPage } from './art';

export type { ArtManifest, ArtPage };

const MANIFEST_KEY = 'sketchbook/manifest.json';
const R2_BASE = 'https://static.karim.cloud';

export function getSketchbookImageUrl(filename: string): string {
    return `${R2_BASE}/sketchbook/${filename}`;
}

export async function getSketchbookManifest({
    fresh = false,
}: { fresh?: boolean } = {}): Promise<ArtManifest> {
    try {
        const res = await fetch(
            `${R2_BASE}/${MANIFEST_KEY}`,
            fresh ? { cache: 'no-store' } : { next: { revalidate: 60 } },
        );
        if (!res.ok) return { pages: [] };
        const manifest: ArtManifest = await res.json();
        manifest.pages.sort((a, b) => a.position - b.position);
        return manifest;
    } catch {
        return { pages: [] };
    }
}

export async function saveSketchbookManifest(
    manifest: ArtManifest,
): Promise<void> {
    manifest.pages.sort((a, b) => a.position - b.position);
    const json = JSON.stringify(manifest, null, 2) + '\n';
    await uploadBufferToR2(Buffer.from(json), MANIFEST_KEY, 'application/json');
}

export function nextPosition(manifest: ArtManifest): number {
    return manifest.pages.length === 0
        ? 1
        : Math.max(...manifest.pages.map(p => p.position)) + 1;
}

export function insertPage(manifest: ArtManifest, page: ArtPage): void {
    const conflict = manifest.pages.find(p => p.position === page.position);
    if (conflict) {
        for (const p of manifest.pages) {
            if (p.position >= page.position) p.position += 1;
        }
    }
    manifest.pages.push(page);
}

export function toUrlSafeFilename(name: string, ext: string): string {
    return (
        name
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9\-]/g, '') + ext
    );
}

export function titleFromFilename(filename: string): string {
    const base = filename.replace(/\.[^.]+$/, '');
    return base.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}
