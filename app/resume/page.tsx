import React from 'react';
import { getEducation, getExperienceList, getResumePage } from '@/lib/resume';
import { notFound } from 'next/navigation';
import { H1, H2, H3, LI, P, UL } from '@/components/primitives';

export default async function ResumePage() {
    const resume = await getResumePage();
    if (resume) {
        const experienceList = await getExperienceList(resume);
        const education = await getEducation(resume);

        return (
            <>
                <H1>Karim Shehadeh</H1>
                <div>
                    <H2>Experience</H2>
                    {experienceList.map(e => (
                        <div key={e?.id}>
                            <H3 key={e?.id}>{e?.name}</H3>
                            <P>{e?.company.title}</P>
                            <P>{e?.overview}</P>
                            <UL>
                                {e?.bullets.map(b => (
                                    <LI key={b.id}>{b.text}</LI>
                                ))}
                            </UL>
                        </div>
                    ))}
                </div>

                <div>
                    <H2>Education</H2>
                    {education.map(e => (
                        <LI key={e.id}>
                            <P>{e?.title}</P>
                            <P>{e?.degree}</P>
                            <P>{e?.graduationDate}</P>
                        </LI>
                    ))}
                </div>
            </>
        );
    } else {
        notFound();
    }
}
