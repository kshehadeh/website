'use client';

import React, { useCallback, useMemo, useState } from 'react';
import Image from 'next/image';
import { PackingGrid } from '@egjs/react-grid';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import { ArtPage } from '@/lib/art';

type Props = {
    pages: ArtPage[];
    basePath: string;
};

const BASE_DIM = 170;

export function Sketchbook({ pages, basePath }: Props) {
    const [index, setIndex] = useState(-1);

    const slides = useMemo(
        () =>
            pages.map(p => ({
                src: p.version
                    ? `${basePath}/${p.filename}?v=${p.version}`
                    : `${basePath}/${p.filename}`,
                alt: p.title,
                width: p.width,
                height: p.height,
            })),
        [pages, basePath],
    );

    const openAt = useCallback((i: number) => setIndex(i), []);
    const close = useCallback(() => setIndex(-1), []);

    if (pages.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
                <div className="mb-4 text-6xl">📖</div>
                <p className="font-mono text-lg">The sketchbook is empty.</p>
                <p className="mt-2 text-sm">Check back soon.</p>
            </div>
        );
    }

    return (
        <div className="select-none">
            <PackingGrid
                className="sketchbook-grid"
                gap={14}
                weightPriority="ratio"
                useResizeObserver
                observeChildren
            >
                {pages.map((p, i) => {
                    const src = p.version
                        ? `${basePath}/${p.filename}?v=${p.version}`
                        : `${basePath}/${p.filename}`;
                    const w = p.width ?? 1;
                    const h = p.height ?? 1;
                    const scale = BASE_DIM / Math.max(w, h);
                    const itemW = Math.round(w * scale);
                    return (
                        <div
                            key={p.filename}
                            data-grid-width={w}
                            data-grid-height={h}
                            onClick={() => openAt(i)}
                            style={{ width: itemW, aspectRatio: `${w} / ${h}` }}
                            className="group relative cursor-zoom-in overflow-hidden rounded-md bg-muted/40 ring-1 ring-border"
                        >
                            <Image
                                src={src}
                                alt={p.title}
                                fill
                                unoptimized
                                sizes="(max-width: 768px) 50vw, 20vw"
                                loading="lazy"
                                className="object-cover transition-transform duration-300 group-hover:scale-[1.04] mt-0"
                            />
                        </div>
                    );
                })}
            </PackingGrid>

            <Lightbox
                open={index >= 0}
                index={Math.max(0, index)}
                close={close}
                slides={slides}
                plugins={[Zoom]}
                zoom={{ maxZoomPixelRatio: 4, scrollToZoom: true }}
                carousel={{ finite: true }}
            />
        </div>
    );
}
