'use client';

import React, { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

type UploadResult = {
    id: string;
    filename: string;
    url?: string;
    error?: string;
    warning?: string;
    status: 'pending' | 'uploading' | 'done' | 'error';
};

export function SketchbookUpload() {
    const router = useRouter();
    const uploadingRef = useRef(false);
    const queueRef = useRef<{ id: string; file: File }[]>([]);
    const [secret, setSecret] = useState('');
    const [secretInput, setSecretInput] = useState('');
    const [secretSaved, setSecretSaved] = useState(false);
    const [googleConnected, setGoogleConnected] = useState(false);
    const [googleConnecting, setGoogleConnecting] = useState(false);
    const [googleMessage, setGoogleMessage] = useState<{
        type: 'success' | 'error';
        text: string;
    } | null>(null);

    React.useEffect(() => {
        const stored = sessionStorage.getItem('sketchbook_upload_secret');
        if (stored) {
            setSecret(stored);
            setSecretSaved(true);
        }
    }, []);

    const checkGoogleStatus = useCallback(async (token: string) => {
        try {
            const res = await fetch('/api/auth/google/status', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setGoogleConnected(data.connected === true);
            }
        } catch {
            // ignore — non-critical
        }
    }, []);

    React.useEffect(() => {
        if (!secretSaved || !secret) return;

        // Check OAuth callback params
        const params = new URLSearchParams(window.location.search);
        if (params.get('google_connected')) {
            setGoogleMessage({ type: 'success', text: 'Google Photos connected.' });
            // Clean up URL
            window.history.replaceState({}, '', '/sketchbook/upload');
        } else if (params.get('google_error')) {
            setGoogleMessage({
                type: 'error',
                text: `Google connection failed: ${params.get('google_error')}`,
            });
            window.history.replaceState({}, '', '/sketchbook/upload');
        }

        void checkGoogleStatus(secret);
    }, [secretSaved, secret, checkGoogleStatus]);
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
        setGoogleConnected(false);
        setGoogleMessage(null);
    };

    const connectGoogle = async () => {
        setGoogleConnecting(true);
        setGoogleMessage(null);
        try {
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { Authorization: `Bearer ${secret}` },
            });
            const data = await res.json();
            if (!res.ok || !data.url) {
                setGoogleMessage({
                    type: 'error',
                    text: data.error || 'Failed to start Google OAuth',
                });
                setGoogleConnecting(false);
                return;
            }
            window.location.href = data.url;
        } catch (err) {
            setGoogleMessage({
                type: 'error',
                text: `Failed to connect: ${err}`,
            });
            setGoogleConnecting(false);
        }
    };

    const disconnectGoogle = async () => {
        try {
            await fetch('/api/auth/google/disconnect', {
                method: 'POST',
                headers: { Authorization: `Bearer ${secret}` },
            });
            setGoogleConnected(false);
            setGoogleMessage({ type: 'success', text: 'Google Photos disconnected.' });
        } catch (err) {
            setGoogleMessage({
                type: 'error',
                text: `Failed to disconnect: ${err}`,
            });
        }
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
                                ? { ...r, status: 'done', url: data.url, warning: data.warning }
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

            {/* Google Photos connection */}
            <div className="flex items-center gap-3 rounded-md border border-border px-4 py-3 font-mono text-sm">
                <span
                    className={
                        googleConnected
                            ? 'text-green-500'
                            : 'text-muted-foreground'
                    }
                >
                    {googleConnected ? '✓' : '○'}
                </span>
                <span className="flex-1">
                    Google Photos {googleConnected ? 'connected' : 'not connected'}
                </span>
                {googleConnected ? (
                    <button
                        onClick={disconnectGoogle}
                        className="text-xs text-muted-foreground underline"
                    >
                        Disconnect
                    </button>
                ) : (
                    <button
                        onClick={connectGoogle}
                        disabled={googleConnecting}
                        className="rounded-md bg-foreground px-3 py-1.5 text-xs text-background disabled:opacity-40"
                    >
                        {googleConnecting ? 'Connecting…' : 'Connect'}
                    </button>
                )}
            </div>
            {googleMessage && (
                <p
                    className={`font-mono text-xs ${googleMessage.type === 'success' ? 'text-green-500' : 'text-red-400'}`}
                >
                    {googleMessage.text}
                </p>
            )}

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
                            {r.warning && (
                                <span className="text-xs text-yellow-500">
                                    {r.warning}
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
