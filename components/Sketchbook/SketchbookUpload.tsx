'use client';

import React, { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

type UploadResult = {
    id: string;
    filename: string;
    url?: string;
    error?: string;
    status: 'pending' | 'uploading' | 'done' | 'error';
};

export function SketchbookUpload() {
    const router = useRouter();
    const uploadingRef = useRef(false);
    const queueRef = useRef<{ id: string; file: File }[]>([]);
    const [secret, setSecret] = useState('');
    const [secretInput, setSecretInput] = useState('');
    const [secretSaved, setSecretSaved] = useState(false);

    React.useEffect(() => {
        const stored = sessionStorage.getItem('sketchbook_upload_secret');
        if (stored) {
            setSecret(stored);
            setSecretSaved(true);
        }
    }, []);
    const [results, setResults] = useState<UploadResult[]>([]);
    const [dragging, setDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const saveSecret = () => {
        sessionStorage.setItem('sketchbook_upload_secret', secretInput);
        setSecret(secretInput);
        setSecretSaved(true);
    };

    const clearSecret = () => {
        sessionStorage.removeItem('sketchbook_upload_secret');
        setSecret('');
        setSecretInput('');
        setSecretSaved(false);
    };

    const uploadOne = useCallback(
        async (id: string, file: File) => {
            setResults(prev =>
                prev.map(r =>
                    r.id === id ? { ...r, status: 'uploading' } : r,
                ),
            );

            const formData = new FormData();
            formData.append('file', file);

            try {
                const res = await fetch('/api/sketchbook/upload', {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${secret}` },
                    body: formData,
                });
                const data = await res.json();
                if (!res.ok) {
                    setResults(prev =>
                        prev.map(r =>
                            r.id === id
                                ? { ...r, status: 'error', error: data.error }
                                : r,
                        ),
                    );
                } else {
                    setResults(prev =>
                        prev.map(r =>
                            r.id === id
                                ? { ...r, status: 'done', url: data.url }
                                : r,
                        ),
                    );
                }
            } catch (err) {
                setResults(prev =>
                    prev.map(r =>
                        r.id === id
                            ? { ...r, status: 'error', error: String(err) }
                            : r,
                    ),
                );
            }
        },
        [secret],
    );

    const processQueue = useCallback(async () => {
        if (uploadingRef.current) return;
        uploadingRef.current = true;

        try {
            while (queueRef.current.length > 0) {
                const next = queueRef.current.shift();
                if (!next) break;
                await uploadOne(next.id, next.file);
            }
            router.refresh();
        } finally {
            uploadingRef.current = false;
            if (queueRef.current.length > 0) {
                void processQueue();
            }
        }
    }, [uploadOne, router]);

    const handleFiles = useCallback(
        (files: FileList | File[]) => {
            const arr = Array.from(files);
            if (arr.length === 0) return;

            const batch = arr.map(file => ({
                id: crypto.randomUUID(),
                file,
            }));

            setResults(prev => [
                ...prev,
                ...batch.map(({ id, file }) => ({
                    id,
                    filename: file.name,
                    status: 'pending' as const,
                })),
            ]);

            queueRef.current.push(...batch);
            void processQueue();
        },
        [processQueue],
    );

    const onDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setDragging(false);
            if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
        },
        [handleFiles],
    );

    if (!secretSaved) {
        return (
            <div className="mx-auto max-w-md space-y-4 py-12">
                <h2 className="font-mono text-lg font-semibold">
                    Enter upload secret
                </h2>
                <input
                    type="password"
                    value={secretInput}
                    onChange={e => setSecretInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && saveSecret()}
                    placeholder="Bearer token"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                    onClick={saveSecret}
                    disabled={!secretInput}
                    className="rounded-md bg-foreground px-4 py-2 text-sm text-background disabled:opacity-40"
                >
                    Save & continue
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6 py-8">
            <div className="flex items-center justify-between">
                <h2 className="font-mono text-lg font-semibold">
                    Upload artwork
                </h2>
                <button
                    onClick={clearSecret}
                    className="text-xs text-muted-foreground underline"
                >
                    Clear secret
                </button>
            </div>

            <div
                onDragOver={e => {
                    e.preventDefault();
                    setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex cursor-pointer items-center justify-center gap-3 rounded-lg border-2 border-dashed px-4 transition-colors ${dragging ? 'border-foreground bg-muted/40' : 'border-border bg-muted/20 hover:border-foreground/40'}`}
                style={{ height: 60 }}
            >
                <p className="font-mono text-xs leading-none text-muted-foreground">
                    Drop images or click to select
                </p>
                <p className="font-mono text-xs leading-none text-muted-foreground">
                    jpg · png · webp · gif
                </p>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    multiple
                    className="hidden"
                    onChange={e =>
                        e.target.files && handleFiles(e.target.files)
                    }
                />
            </div>

            {results.length > 0 && (
                <ul className="space-y-2">
                    {results.map(r => (
                        <li
                            key={r.id}
                            className="flex items-center gap-3 rounded-md border border-border px-4 py-3 font-mono text-sm"
                        >
                            <span
                                className={
                                    r.status === 'done'
                                        ? 'text-green-500'
                                        : r.status === 'error'
                                          ? 'text-red-500'
                                          : r.status === 'uploading'
                                            ? 'text-muted-foreground animate-pulse'
                                            : 'text-muted-foreground'
                                }
                            >
                                {r.status === 'done'
                                    ? '✓'
                                    : r.status === 'error'
                                      ? '✗'
                                      : r.status === 'uploading'
                                        ? '…'
                                        : '○'}
                            </span>
                            <span className="flex-1 truncate">
                                {r.filename}
                            </span>
                            {r.url && (
                                <a
                                    href={r.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-500 underline"
                                >
                                    view
                                </a>
                            )}
                            {r.error && (
                                <span className="text-xs text-red-400">
                                    {r.error}
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
