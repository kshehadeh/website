import React, { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import ContentLayout from '@/components/ContentLayout/ContentLayout';
import { SketchbookUpload } from '@/components/Sketchbook/SketchbookUpload';
import { SketchbookThumbnailGrid } from '@/components/Sketchbook/SketchbookThumbnailGrid';
import { HeadingWithRotatedBg } from '@/components/HeadingWithRotatedBg';
import { getSketchbookManifest } from '@/lib/sketchbook';

export const metadata: Metadata = {
    title: 'Upload | Sketchbook',
    robots: { index: false, follow: false },
};

const PAGE_SIZE = 10;

async function GallerySection({
    searchParams,
    secret,
}: {
    searchParams: Promise<{ page?: string }>;
    secret: string;
}) {
    const { page: pageParam } = await searchParams;
    const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1);

    const manifest = await getSketchbookManifest();
    const total = manifest.pages.length;
    if (total === 0) return null;

    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const clampedPage = Math.min(page, totalPages);
    const slice = manifest.pages.slice(
        (clampedPage - 1) * PAGE_SIZE,
        clampedPage * PAGE_SIZE,
    );

    return (
        <section className="mt-6">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="font-mono text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    In sketchbook ({total})
                </h2>
                <span className="font-mono text-xs text-muted-foreground">
                    Page {clampedPage} of {totalPages}
                </span>
            </div>

            <SketchbookThumbnailGrid
                key={clampedPage}
                pages={slice}
                secret={secret}
            />

            {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                    {clampedPage > 1 ? (
                        <Link
                            href={`?page=${clampedPage - 1}`}
                            className="rounded-md border border-border px-3 py-1.5 font-mono text-sm hover:bg-muted/40"
                        >
                            ← Prev
                        </Link>
                    ) : (
                        <span className="rounded-md border border-border px-3 py-1.5 font-mono text-sm opacity-30">
                            ← Prev
                        </span>
                    )}

                    <div className="flex gap-1">
                        {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1,
                        ).map(p => (
                            <Link
                                key={p}
                                href={`?page=${p}`}
                                className={`rounded-md px-3 py-1.5 font-mono text-sm ${p === clampedPage ? 'border-2 border-foreground font-bold' : 'border border-border hover:bg-muted/40'}`}
                            >
                                {p}
                            </Link>
                        ))}
                    </div>

                    {clampedPage < totalPages ? (
                        <Link
                            href={`?page=${clampedPage + 1}`}
                            className="rounded-md border border-border px-3 py-1.5 font-mono text-sm hover:bg-muted/40"
                        >
                            Next →
                        </Link>
                    ) : (
                        <span className="rounded-md border border-border px-3 py-1.5 font-mono text-sm opacity-30">
                            Next →
                        </span>
                    )}
                </div>
            )}
        </section>
    );
}

export default function SketchbookUploadPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    if (!process.env.SKETCHBOOK_UPLOAD_SECRET) {
        return (
            <ContentLayout pageType="sketchbook" sidecar={null}>
                <div className="px-2 py-8 md:px-6">
                    <p className="font-mono text-sm text-muted-foreground">
                        Upload is not configured.
                    </p>
                </div>
            </ContentLayout>
        );
    }

    return (
        <ContentLayout pageType="sketchbook" sidecar={null}>
            <div className="px-2 py-8 md:px-6">
                <HeadingWithRotatedBg>Upload</HeadingWithRotatedBg>
                <SketchbookUpload />
                <Suspense>
                    <GallerySection
                        searchParams={searchParams}
                        secret={process.env.SKETCHBOOK_UPLOAD_SECRET}
                    />
                </Suspense>
            </div>
        </ContentLayout>
    );
}
