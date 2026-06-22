import React from 'react';
import { Metadata } from 'next';
import ContentLayout from '@/components/ContentLayout/ContentLayout';
import { Sketchbook } from '@/components/Sketchbook/Sketchbook';
import { getSketchbookManifest } from '@/lib/sketchbook';
import { HeadingWithRotatedBg } from '@/components/HeadingWithRotatedBg';

export const metadata: Metadata = {
    title: 'Sketchbook | Karim Shehadeh',
    description: 'A collection of sketches and artwork by Karim Shehadeh.',
};

function seededShuffle<T>(items: T[], seed: string): T[] {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
    }
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.abs(hash + i) % (i + 1);
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

export default async function SketchbookPage() {
    const manifest = await getSketchbookManifest();
    const pages = seededShuffle(manifest.pages, 'sketchbook').slice(0, 20);

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
