'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Download, Pencil, RotateCw, Trash2 } from 'lucide-react';
import type { ArtPage } from '@/lib/art';
import { cn } from '@/lib/util';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { SketchbookLightbox } from './SketchbookLightbox';

const BASE_PATH = 'https://static.karim.cloud/sketchbook';

type Props = {
    pages: ArtPage[];
    secret: string;
};

type Operation = 'rotate-left' | 'rotate-right' | 'mirror';

type ItemState =
    | { status: 'idle' }
    | { status: 'renaming'; draft: string }
    | { status: 'busy' };

type ModifyModal = { filename: string; operation: Operation };

const OPERATIONS: { value: Operation; label: string }[] = [
    { value: 'rotate-left', label: 'Rotate Left 90°' },
    { value: 'rotate-right', label: 'Rotate Right 90°' },
    { value: 'mirror', label: 'Mirror' },
];

function ModifyDialog({
    onClose,
    onConfirm,
}: {
    onClose: () => void;
    onConfirm: (op: Operation) => void;
}) {
    const [operation, setOperation] = useState<Operation>('rotate-left');
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        dialogRef.current?.showModal();
    }, []);

    return (
        <dialog
            ref={dialogRef}
            onClose={onClose}
            className="w-full max-w-sm rounded-xl border border-border bg-background p-6 shadow-xl backdrop:bg-black/50 open:flex open:flex-col open:gap-5"
        >
            <h2 className="font-mono text-sm font-semibold">Modify image</h2>

            <div className="flex flex-col gap-2">
                <label className="font-mono text-xs text-muted-foreground">
                    Rotate
                </label>
                <select
                    value={operation}
                    onChange={e => setOperation(e.target.value as Operation)}
                    className="rounded-md border border-border bg-background px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                    {OPERATIONS.map(op => (
                        <option key={op.value} value={op.value}>
                            {op.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex justify-end gap-2">
                <button
                    type="button"
                    onClick={() => dialogRef.current?.close()}
                    className="rounded-md border border-border px-4 py-2 font-mono text-sm hover:bg-muted/40"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={() => onConfirm(operation)}
                    className="rounded-md bg-foreground px-4 py-2 font-mono text-sm text-background"
                >
                    Modify
                </button>
            </div>
        </dialog>
    );
}

function IconAction({
    label,
    disabled,
    onClick,
    href,
    download,
    className,
    children,
}: {
    label: string;
    disabled?: boolean;
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
    href?: string;
    download?: string;
    className?: string;
    children: React.ReactNode;
}) {
    const classes = cn(
        'inline-flex items-center justify-center rounded p-0.5 text-foreground/70 hover:text-foreground disabled:opacity-40',
        className,
    );

    const trigger = href ? (
        <a
            href={href}
            download={download}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClick}
            aria-label={label}
            className={classes}
        >
            {children}
        </a>
    ) : (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            aria-label={label}
            className={classes}
        >
            {children}
        </button>
    );

    return (
        <Tooltip>
            <TooltipTrigger asChild>{trigger}</TooltipTrigger>
            <TooltipContent className="font-mono text-xs">
                {label}
            </TooltipContent>
        </Tooltip>
    );
}

export function SketchbookThumbnailGrid({
    pages: initialPages,
    secret,
}: Props) {
    const router = useRouter();
    const [pages, setPages] = useState(initialPages);
    const [states, setStates] = useState<Record<string, ItemState>>({});
    const [modifyModal, setModifyModal] = useState<ModifyModal | null>(null);
    const [index, setIndex] = useState(-1);
    // Cache-bust token per filename so the browser reloads after a modify
    const [versions, setVersions] = useState<Record<string, number>>({});

    useEffect(() => {
        setPages(initialPages);
    }, [initialPages]);

    useEffect(() => {
        if (index >= pages.length) setIndex(-1);
    }, [index, pages.length]);

    const closeLightbox = useCallback(() => setIndex(-1), []);

    function stateOf(filename: string): ItemState {
        return states[filename] ?? { status: 'idle' };
    }

    function setState(filename: string, next: ItemState) {
        setStates(prev => ({ ...prev, [filename]: next }));
    }

    async function handleDelete(filename: string) {
        if (!confirm(`Delete "${filename}"?`)) return;
        setState(filename, { status: 'busy' });
        const res = await fetch(
            `/api/sketchbook/item?filename=${encodeURIComponent(filename)}`,
            {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${secret}` },
            },
        );
        if (res.ok) {
            setPages(prev => prev.filter(p => p.filename !== filename));
            router.refresh();
        } else {
            const { error } = await res.json();
            alert(`Delete failed: ${error}`);
            setState(filename, { status: 'idle' });
        }
    }

    async function handleRename(filename: string, title: string) {
        setState(filename, { status: 'busy' });
        const res = await fetch('/api/sketchbook/item', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${secret}`,
            },
            body: JSON.stringify({ filename, title }),
        });
        if (res.ok) {
            const { page } = await res.json();
            setPages(prev =>
                prev.map(p =>
                    p.filename === filename ? { ...p, ...page } : p,
                ),
            );
            setState(page.filename, { status: 'idle' });
            router.refresh();
        } else {
            const { error } = await res.json();
            alert(`Rename failed: ${error}`);
            setState(filename, { status: 'idle' });
        }
    }

    async function handleModify(filename: string, operation: Operation) {
        setModifyModal(null);
        setState(filename, { status: 'busy' });
        const res = await fetch('/api/sketchbook/modify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${secret}`,
            },
            body: JSON.stringify({ filename, operation }),
        });
        if (res.ok) {
            const { version, warning } = await res.json();
            setVersions(prev => ({
                ...prev,
                [filename]: version ?? Date.now(),
            }));
            setState(filename, { status: 'idle' });
            if (warning) {
                console.warn(
                    `Google Photos warning for ${filename}: ${warning}`,
                );
            }
        } else {
            const { error } = await res.json();
            alert(`Modify failed: ${error}`);
            setState(filename, { status: 'idle' });
        }
    }

    if (pages.length === 0) {
        return (
            <p className="font-mono text-sm text-muted-foreground">
                No items on this page.
            </p>
        );
    }

    return (
        <TooltipProvider delayDuration={120}>
            {modifyModal && (
                <ModifyDialog
                    onClose={() => setModifyModal(null)}
                    onConfirm={op => handleModify(modifyModal.filename, op)}
                />
            )}

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                {pages.map((p, i) => {
                    const v = versions[p.filename];
                    const src = `${BASE_PATH}/${p.filename}${v ? `?v=${v}` : ''}`;
                    const s = stateOf(p.filename);
                    const busy = s.status === 'busy';

                    return (
                        <div
                            key={p.filename}
                            className="group relative flex flex-col gap-1"
                        >
                            <div
                                onClick={() => !busy && setIndex(i)}
                                className="relative aspect-square cursor-zoom-in overflow-hidden rounded-md bg-muted/40 ring-1 ring-border"
                            >
                                <Image
                                    src={src}
                                    alt={p.title}
                                    fill
                                    unoptimized
                                    sizes="20vw"
                                    className="object-cover mt-0"
                                />
                                <div className="absolute bottom-2 left-2 opacity-0 transition-opacity group-hover:opacity-100">
                                    <p
                                        className="truncate font-mono text-[10px] rounded px-1.5 py-0.5"
                                        style={{
                                            background: 'white',
                                            color: 'black',
                                        }}
                                        title={p.title}
                                    >
                                        {p.title}
                                    </p>
                                </div>
                                {busy && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                        <span className="font-mono text-xs text-white">
                                            …
                                        </span>
                                    </div>
                                )}
                            </div>

                            {s.status === 'renaming' ? (
                                <form
                                    onSubmit={e => {
                                        e.preventDefault();
                                        handleRename(p.filename, s.draft);
                                    }}
                                    className="flex gap-1"
                                >
                                    <input
                                        autoFocus
                                        value={s.draft}
                                        onChange={e =>
                                            setState(p.filename, {
                                                status: 'renaming',
                                                draft: e.target.value,
                                            })
                                        }
                                        onKeyDown={e =>
                                            e.key === 'Escape' &&
                                            setState(p.filename, {
                                                status: 'idle',
                                            })
                                        }
                                        className="min-w-0 flex-1 rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] focus:outline-none focus:ring-1 focus:ring-ring"
                                    />
                                    <button
                                        type="submit"
                                        className="font-mono text-[10px] text-foreground"
                                    >
                                        ✓
                                    </button>
                                </form>
                            ) : (
                                <div className="flex items-center justify-between px-0.5">
                                    <IconAction
                                        label="Rename"
                                        disabled={busy}
                                        onClick={() =>
                                            setState(p.filename, {
                                                status: 'renaming',
                                                draft: p.title,
                                            })
                                        }
                                    >
                                        <Pencil className="h-3.5 w-3.5" />
                                    </IconAction>
                                    <IconAction
                                        label="Modify"
                                        disabled={busy}
                                        onClick={() =>
                                            setModifyModal({
                                                filename: p.filename,
                                                operation: 'rotate-left',
                                            })
                                        }
                                    >
                                        <RotateCw className="h-3.5 w-3.5" />
                                    </IconAction>
                                    <IconAction
                                        label="Download"
                                        href={src}
                                        download={p.filename}
                                    >
                                        <Download className="h-3.5 w-3.5" />
                                    </IconAction>
                                    <IconAction
                                        label="Delete"
                                        disabled={busy}
                                        onClick={() => handleDelete(p.filename)}
                                        className="text-red-500 hover:text-red-400"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </IconAction>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <SketchbookLightbox
                pages={pages}
                basePath={BASE_PATH}
                index={index}
                onClose={closeLightbox}
                versions={versions}
            />
        </TooltipProvider>
    );
}
