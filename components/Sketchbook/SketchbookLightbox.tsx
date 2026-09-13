'use client';

import React, { useMemo } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import type { ArtPage } from '@/lib/art';

type Props = {
    pages: ArtPage[];
    basePath: string;
    index: number;
    onClose: () => void;
    versions?: Record<string, number>;
};

export function SketchbookLightbox({
    pages,
    basePath,
    index,
    onClose,
    versions,
}: Props) {
    const slides = useMemo(
        () =>
            pages.map(p => {
                const v = versions?.[p.filename] ?? p.version;
                return {
                    src: v
                        ? `${basePath}/${p.filename}?v=${v}`
                        : `${basePath}/${p.filename}`,
                    alt: p.title,
                    width: p.width,
                    height: p.height,
                };
            }),
        [pages, basePath, versions],
    );

    return (
        <Lightbox
            open={index >= 0}
            index={Math.max(0, index)}
            close={onClose}
            slides={slides}
            plugins={[Zoom]}
            zoom={{ maxZoomPixelRatio: 4, scrollToZoom: true }}
            carousel={{ finite: true }}
        />
    );
}
