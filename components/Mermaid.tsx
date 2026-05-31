'use client';
import React from 'react';

import { Dialog, DialogPanel } from '@headlessui/react';
import mermaid from 'mermaid';
import { Maximize2, RotateCcw, X, ZoomIn, ZoomOut } from 'lucide-react';
import {
    useCallback,
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
} from 'react';

mermaid.initialize({
    startOnLoad: false,
    theme: 'forest',
});

function useMermaidSvg(definition: string, id: string) {
    const [svg, setSvg] = useState('');

    useEffect(() => {
        let isMounted = true;

        mermaid
            .render(id, definition)
            .then(({ svg: rendered }) => {
                if (isMounted) setSvg(rendered);
            })
            .catch((error: unknown) => {
                if (!isMounted) return;
                const message =
                    error instanceof Error ? error.message : String(error);
                setSvg(
                    `<pre>Failed to render Mermaid diagram: ${message}</pre>`,
                );
            });

        return () => {
            isMounted = false;
        };
    }, [definition, id]);

    return svg;
}

function ZoomPanViewer({ svg, onClose }: { svg: string; onClose: () => void }) {
    const [scale, setScale] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragOriginRef = useRef<{ x: number; y: number } | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);

    const clampScale = (value: number) => Math.max(0.2, Math.min(4, value));

    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.innerHTML = svg;
        }
    }, [svg]);

    const zoomAt = useCallback(
        (clientX: number, clientY: number, factor: number) => {
            const container = containerRef.current;
            if (!container) return;
            const rect = container.getBoundingClientRect();
            const originX = clientX - rect.left;
            const originY = clientY - rect.top;
            const nextScale = clampScale(scale * factor);
            if (nextScale === scale) return;

            const worldX = (originX - offset.x) / scale;
            const worldY = (originY - offset.y) / scale;

            setScale(nextScale);
            setOffset({
                x: originX - worldX * nextScale,
                y: originY - worldY * nextScale,
            });
        },
        [offset.x, offset.y, scale],
    );

    const zoomByButton = (factor: number) => {
        const container = containerRef.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, factor);
    };

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const onNativeWheel = (event: WheelEvent) => {
            if (!(event.ctrlKey || event.metaKey)) {
                return;
            }
            event.preventDefault();
            zoomAt(event.clientX, event.clientY, event.deltaY > 0 ? 0.9 : 1.1);
        };

        container.addEventListener('wheel', onNativeWheel, { passive: false });
        return () => {
            container.removeEventListener('wheel', onNativeWheel);
        };
    }, [zoomAt]);

    const onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.button !== 0) return;
        setIsDragging(true);
        dragOriginRef.current = {
            x: event.clientX - offset.x,
            y: event.clientY - offset.y,
        };
    };

    const onMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging || !dragOriginRef.current) return;
        setOffset({
            x: event.clientX - dragOriginRef.current.x,
            y: event.clientY - dragOriginRef.current.y,
        });
    };

    const stopDragging = () => {
        setIsDragging(false);
        dragOriginRef.current = null;
    };

    const resetView = () => {
        setScale(1);
        setOffset({ x: 0, y: 0 });
    };

    return (
        <div className="relative flex h-full w-full flex-col">
            <div className="absolute right-3 top-3 z-10 flex gap-1 rounded-md border border-zinc-200 bg-white/90 p-1 dark:border-zinc-700 dark:bg-zinc-900/90">
                <button
                    type="button"
                    aria-label="Zoom in"
                    onClick={() => zoomByButton(1.15)}
                    className="rounded p-1 text-zinc-700 transition hover:bg-zinc-200 dark:text-zinc-200 dark:hover:bg-zinc-700"
                >
                    <ZoomIn size={16} />
                </button>
                <button
                    type="button"
                    aria-label="Zoom out"
                    onClick={() => zoomByButton(0.85)}
                    className="rounded p-1 text-zinc-700 transition hover:bg-zinc-200 dark:text-zinc-200 dark:hover:bg-zinc-700"
                >
                    <ZoomOut size={16} />
                </button>
                <button
                    type="button"
                    aria-label="Reset view"
                    onClick={resetView}
                    className="rounded p-1 text-zinc-700 transition hover:bg-zinc-200 dark:text-zinc-200 dark:hover:bg-zinc-700"
                >
                    <RotateCcw size={16} />
                </button>
                <button
                    type="button"
                    aria-label="Close"
                    onClick={onClose}
                    className="rounded p-1 text-zinc-700 transition hover:bg-zinc-200 dark:text-zinc-200 dark:hover:bg-zinc-700"
                >
                    <X size={16} />
                </button>
            </div>
            <div
                ref={containerRef}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={stopDragging}
                onMouseLeave={stopDragging}
                className={`h-full w-full overflow-hidden rounded-md bg-white dark:bg-zinc-950 ${
                    isDragging ? 'cursor-grabbing' : 'cursor-grab'
                }`}
            >
                <div
                    ref={contentRef}
                    className="inline-block min-h-full min-w-full p-6"
                    style={{
                        transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                        transformOrigin: '0 0',
                    }}
                />
            </div>
        </div>
    );
}

export function Mermaid({ children }: React.PropsWithChildren) {
    const reactId = useId();
    const chartId = `mermaid-${reactId.replaceAll(':', '')}`;
    const definition =
        typeof children === 'string'
            ? children
            : React.Children.toArray(children).join('');

    const svg = useMermaidSvg(definition, chartId);
    const [isOpen, setIsOpen] = useState(false);
    const inlineRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (inlineRef.current) {
            inlineRef.current.innerHTML = svg;
        }
    }, [svg]);

    // Give the maximized copy unique internal ids so it never collides with the
    // inline SVG's marker/style references while both are mounted.
    const dialogSvg = useMemo(
        () => svg.replaceAll(chartId, `${chartId}-fs`),
        [svg, chartId],
    );

    return (
        <div className="relative rounded-lg border border-zinc-200 bg-white/90 p-2 dark:border-zinc-800 dark:bg-zinc-900/50">
            <button
                type="button"
                aria-label="Expand diagram"
                onClick={() => setIsOpen(true)}
                className="absolute right-3 top-3 z-10 rounded-md border border-zinc-200 bg-white/90 p-1 text-zinc-700 transition hover:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-900/90 dark:text-zinc-200 dark:hover:bg-zinc-700"
            >
                <Maximize2 size={16} />
            </button>
            <div
                ref={inlineRef}
                className="w-full overflow-auto rounded-md border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
            />

            <Dialog
                open={isOpen}
                onClose={() => setIsOpen(false)}
                className="relative z-[100]"
            >
                <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
                <div className="fixed inset-0 flex p-4">
                    <DialogPanel className="flex h-full w-full flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-950">
                        <ZoomPanViewer
                            svg={dialogSvg}
                            onClose={() => setIsOpen(false)}
                        />
                    </DialogPanel>
                </div>
            </Dialog>
        </div>
    );
}
