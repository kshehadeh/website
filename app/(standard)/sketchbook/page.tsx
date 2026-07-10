import React from 'react';
import { cacheLife, cacheTag } from 'next/cache';
import ContentLayout from '@/components/ContentLayout/ContentLayout';
import { Sketchbook } from '@/components/Sketchbook/Sketchbook';
import {
    getSketchbookManifest,
    SKETCHBOOK_MANIFEST_TAG,
} from '@/lib/sketchbook';
import { HeadingWithRotatedBg } from '@/components/HeadingWithRotatedBg';
import type { ArtPage } from '@/lib/art';

export async function generateMetadata() {
    'use cache';
    cacheLife({ stale: 3600, revalidate: 3600 });
    cacheTag('sketchbook-page-metadata');

    return {
        title: 'Sketchbook | Karim Shehadeh',
        description: 'A collection of sketches and artwork by Karim Shehadeh.',
        alternates: {
            canonical: '/sketchbook',
        },
    };
}

/** Fisher–Yates shuffle; order is frozen by the page cache until revalidation. */
function shuffle<T>(items: T[]): T[] {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

async function getShuffledSketchbookPages(): Promise<ArtPage[]> {
    'use cache';
    // All visitors share this order until the cache revalidates (~1h) or the
    // manifest is invalidated after an upload/delete.
    cacheLife({ stale: 3600, revalidate: 3600, expire: 7200 });
    cacheTag(SKETCHBOOK_MANIFEST_TAG);
    cacheTag('sketchbook-page');

    const manifest = await getSketchbookManifest();
    return shuffle(manifest.pages).slice(0, 20);
}

export default async function SketchbookPage() {
    const pages = await getShuffledSketchbookPages();

    return (
        <ContentLayout pageType="sketchbook" sidecar={null}>
            <div className="px-2 py-8 md:px-6">
                <HeadingWithRotatedBg>Sketchbook</HeadingWithRotatedBg>
                <Sketchbook
                    pages={pages}
                    basePath="https://static.karim.cloud/sketchbook"
                />
            </div>
        </ContentLayout>
    );
}
