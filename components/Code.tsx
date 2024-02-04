import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

export function Code({
    language,
    text,
    showLineNumbers,
}: {
    language: string;
    text: string;
    showLineNumbers: boolean;
}) {
    return (
        <SyntaxHighlighter
            language={language.toLowerCase()}
            style={dark}
            showLineNumbers={showLineNumbers}
        >
            {text}
        </SyntaxHighlighter>
    );
}
