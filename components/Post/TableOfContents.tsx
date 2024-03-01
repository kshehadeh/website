import { Heading, getAnchorIdFromHeading } from '@/lib/blog';
import React from 'react';
import { A } from '../primitives';

const IndentationMap: { [key: number]: string } = {
    1: 'ml-0 font-bold text-sm',
    2: 'ml-2 text-sm',
    3: 'ml-4 text-xs',
};

function TocHeading({ heading }: { heading: Heading }) {
    const cls = IndentationMap[heading.level];
    return (
        <A
            href={`#${getAnchorIdFromHeading(heading.text)}`}
            additionalClasses={[cls, 'block']}
        >
            {heading.text}
        </A>
    );
}

export function TableOfContents({ headings }: { headings: Heading[] }) {
    return (
        <aside>
            <h2>Table of Contents</h2>
            <div className="m-0 p-0">
                {headings.map(heading => (
                    <TocHeading key={heading.text} heading={heading} />
                ))}
            </div>
        </aside>
    );
}
