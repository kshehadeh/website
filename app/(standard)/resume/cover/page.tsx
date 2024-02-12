import { A, H1, LI, UL } from '@/components/primitives';
import { getCoverLetters } from '@/lib/resume';
import timeouts from '@/lib/timeouts';
import React from 'react';

export const revalidate = timeouts.resume;

export default async function Page() {
    const covers = await getCoverLetters();
    return (
        <>
            <H1>Cover Letters</H1>
            <UL>
                {covers.map(cover => (
                    <LI key={cover.id}>
                        <A
                            additionalClasses={['font-bold']}
                            href={`/resume/cover/${cover.id}`}
                        >
                            {cover.title}
                        </A>
                        <ul className="inline-block">
                            {cover.tags.map(tag => (
                                <li
                                    className=" text-xs bg-yellow-200 p-1 ml-1 rounded-lg inline-block"
                                    key={tag}
                                >
                                    {tag}
                                </li>
                            ))}
                        </ul>
                    </LI>
                ))}
            </UL>
        </>
    );
}
