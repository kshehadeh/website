'use client';

import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs, vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { useTheme } from 'next-themes';

export function Code({ language, text }: { language: string; text: string }) {
    const { theme } = useTheme();
    const [mounted, setMounted] = React.useState(false);
    const [copied, setCopied] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    React.useEffect(() => {
        if (!copied) {
            return;
        }

        const timeout = window.setTimeout(() => {
            setCopied(false);
        }, 1600);

        return () => {
            window.clearTimeout(timeout);
        };
    }, [copied]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
        } catch (error) {
            console.error('Failed to copy code block text', error);
        }
    };

    // Default to dark if not mounted yet
    const isLightTheme = mounted && theme === 'light';
    const codeStyle = isLightTheme ? vs : vs2015;

    return (
        <div style={{ position: 'relative' }}>
            <button
                type="button"
                onClick={handleCopy}
                aria-label={copied ? 'Code copied' : 'Copy code to clipboard'}
                title={copied ? 'Copied' : 'Copy code'}
                style={{
                    position: 'absolute',
                    top: '0.4rem',
                    right: '0.4rem',
                    zIndex: 1,
                    borderRadius: '0.375rem',
                    border: isLightTheme
                        ? '1px solid rgba(31, 41, 55, 0.14)'
                        : '1px solid rgba(148, 163, 184, 0.2)',
                    background: isLightTheme
                        ? 'rgba(255, 255, 255, 0.9)'
                        : 'rgba(17, 24, 39, 0.82)',
                    color: isLightTheme ? '#374151' : '#d1d5db',
                    width: '1.9rem',
                    height: '1.9rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                }}
            >
                {copied ? (
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                ) : (
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <rect
                            x="9"
                            y="9"
                            width="13"
                            height="13"
                            rx="2"
                            ry="2"
                        />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                )}
            </button>
            <SyntaxHighlighter
                language={language.toLowerCase()}
                style={codeStyle}
                customStyle={{
                    borderRadius: '0.625rem',
                    margin: 0,
                    padding: '1rem 1.25rem',
                    border: isLightTheme
                        ? '1px solid rgba(31, 41, 55, 0.12)'
                        : '1px solid rgba(148, 163, 184, 0.16)',
                    background: isLightTheme ? '#f6f8fa' : '#1e1e1e',
                    boxShadow: isLightTheme
                        ? '0 1px 2px rgba(15, 23, 42, 0.06)'
                        : '0 6px 16px rgba(2, 6, 23, 0.35)',
                    fontSize: 'inherit',
                    lineHeight: 1.6,
                }}
                codeTagProps={{
                    style: {
                        fontFamily:
                            'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                    },
                }}
            >
                {text}
            </SyntaxHighlighter>
        </div>
    );
}
