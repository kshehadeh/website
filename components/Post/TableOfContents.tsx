import { Heading, getAnchorIdFromHeading } from '@/lib/blog';
import React from 'react';
import { A } from '../primitives';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { HeadingWithRotatedBg } from '@/components/HeadingWithRotatedBg';

const IndentationMap: { [key: number]: string } = {
    1: 'ml-0 font-semibold text-sm',
    2: 'ml-2 text-sm font-medium',
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
        <Card className="mb-4">
            <CardHeader>
                <HeadingWithRotatedBg as="h2" className="text-base font-semibold font-mono">
                    Table of Contents
                </HeadingWithRotatedBg>
            </CardHeader>
            <CardContent>
                <div className="m-0 p-0">
                    {headings.map(heading => (
                        <TocHeading key={heading.text} heading={heading} />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
