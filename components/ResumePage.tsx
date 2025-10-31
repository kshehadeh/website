'use client';

import React, { useCallback, useState } from 'react';
import { useResizeObserver } from '@wojtekmaj/react-hooks';

import { pdfjs, Document, Page } from 'react-pdf';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import type { PDFDocumentProxy } from 'pdfjs-dist';
import Link from 'next/link';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

const options = {
    cMapUrl: '/cmaps/',
    standardFontDataUrl: '/standard_fonts/',
};

const maxWidth = 1400;

const resizeObserverOptions = {};

export default function ResumePage() {
    const file = '/api/resume';
    const [numPages, setNumPages] = useState<number>();
    const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
    const [containerWidth, setContainerWidth] = useState<number>();

    function onDocumentLoadSuccess({
        numPages: nextNumPages,
    }: PDFDocumentProxy): void {
        setNumPages(nextNumPages);
    }

    const onResize = useCallback<ResizeObserverCallback>(entries => {
        const [entry] = entries;

        if (entry) {
            setContainerWidth(entry.contentRect.width);
        }
    }, []);

    useResizeObserver(containerRef, resizeObserverOptions, onResize);

    return (
        <div className="relative">
            <div className="absolute right-0 top-0 z-10">
                <Link download className="button" href="/api/resume">
                    Download Resume
                </Link>
            </div>
            <div ref={setContainerRef} className="w-full h-full">
                <Document
                    file={file}
                    onLoadSuccess={onDocumentLoadSuccess}
                    options={options}
                >
                    {Array.from(new Array(numPages), (_el, index) => (
                        <Page
                            key={`page_${index + 1}`}
                            pageNumber={index + 1}
                            width={
                                containerWidth
                                    ? Math.min(containerWidth, maxWidth)
                                    : maxWidth
                            }
                        />
                    ))}
                </Document>
            </div>
        </div>
    );
}
