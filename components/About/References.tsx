import React from 'react';
import { PersonalReference } from '@/lib/about';
import { A } from '../primitives';

function PersonalReferenceItem({
    reference,
}: {
    reference: PersonalReference;
}) {
    return (
        <ul>
            <li>
                <A href={reference.url} target="_blank" additionalClasses={["flex","flex-row","gap-1"]}>
                {reference.icon && (
                    <img
                        src={reference.icon}
                        title={reference.title}
                        className="w-5 h-5"
                    />
                )}
                {reference.title}
                </A>
            </li>
        </ul>
    );
}

export default function PersonalReferencesList({
    references,
}: {
    references: PersonalReference[];
}) {
    return (
        <div className="flex flex-row gap-3">
            {references.map(ref => (
                <PersonalReferenceItem key={ref.title} reference={ref} />
            ))}
        </div>
    );
}
