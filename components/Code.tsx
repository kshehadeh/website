'use client';

import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { dark, github } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { useTheme } from 'next-themes';

export function Code({
    language,
    text,
    showLineNumbers,
}: {
    language: string;
    text: string;
    showLineNumbers: boolean;
}) {
    const { theme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Default to dark if not mounted yet
    const codeStyle = mounted && theme === 'light' ? github : dark;

    return (
        <SyntaxHighlighter
            language={language.toLowerCase()}
            style={codeStyle}
            showLineNumbers={showLineNumbers}
            customStyle={{
                borderRadius: '0.5rem',
                padding: '1rem',
                backgroundColor: 'hsl(var(--muted))',
            }}
        >
            {text}
        </SyntaxHighlighter>
    );
}
