import React from 'react';

export function Tag({ text, url }: { text: string; url: string }) {
    return (
        <a
            href={url}
            className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
        >
            {text}
        </a>
    );
}
