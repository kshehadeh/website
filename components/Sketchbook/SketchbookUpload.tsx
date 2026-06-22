'use client';

import React, { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

type UploadResult = {
    filename: string;
    url?: string;
    error?: string;
    status: 'pending' | 'uploading' | 'done' | 'error';
};

export function SketchbookUpload() {
    const router = useRouter();
    const inFlightRef = useRef(0);
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

    const uploadFile = useCallback(
        async (file: File, title?: string) => {
            const id = file.name;
            inFlightRef.current += 1;
            setResults(prev => [
                ...prev,
                { filename: file.name, status: 'uploading' },
            ]);

            const formData = new FormData();
            formData.append('file', file);
            if (title) formData.append('title', title);

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
                            r.filename === id
                                ? { ...r, status: 'error', error: data.error }
                                : r,
                        ),
                    );
                } else {
                    setResults(prev =>
                        prev.map(r =>
                            r.filename === id
                                ? { ...r, status: 'done', url: data.url }
                                : r,
                        ),
                    );
                }
            } catch (err) {
                setResults(prev =>
                    prev.map(r =>
                        r.filename === id
                            ? { ...r, status: 'error', error: String(err) }
                            : r,
                    ),
                );
            } finally {
                inFlightRef.current -= 1;
                if (inFlightRef.current === 0) router.refresh();
            }
        },
        [secret, router],
    );

    const handleFiles = useCallback(
        (files: FileList | File[]) => {
            const arr = Array.from(files);
            for (const file of arr) {
                uploadFile(file);
            }
        },
        [uploadFile],
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
                    {results.map((r, i) => (
                        <li
                            key={i}
                            className="flex items-center gap-3 rounded-md border border-border px-4 py-3 font-mono text-sm"
                        >
                            <span
                                className={
                                    r.status === 'done'
                                        ? 'text-green-500'
                                        : r.status === 'error'
                                          ? 'text-red-500'
                                          : 'text-muted-foreground animate-pulse'
                                }
                            >
                                {r.status === 'done'
                                    ? '✓'
                                    : r.status === 'error'
                                      ? '✗'
                                      : '…'}
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
