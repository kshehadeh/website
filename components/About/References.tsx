import React from 'react';
import { PersonalReference } from '@/lib/about';
import Image from 'next/image';

function PersonalReferenceItem({
    reference,
}: {
    reference: PersonalReference;
}) {
    return (
        <li>
            <a
                href={reference.url}
                target="_blank"
                className={'flex flex-row gap-1'}
                rel="noreferrer noopener"
            >
                {reference.icon && (
                    <Image
                        src={reference.icon}
                        title={reference.title}
                        alt={reference.title}
                        className="w-5 h-5 not-prose"
                        width={20}
                        height={20}
                    />
                )}
            </a>
        </li>
    );
}

export default function PersonalReferencesList({
    references,
}: {
    references: PersonalReference[];
}) {
    return (
        <ul className="list-none flex flex-row gap-3 flex-wrap">
            {references.map(ref => (
                <PersonalReferenceItem key={ref.title} reference={ref} />
            ))}
        </ul>
    );
}
