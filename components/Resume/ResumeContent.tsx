'use client';

import React from 'react';
import PersonalReferencesList from '../About/References';
import PrintableContent from '../PrintableContent';
import { H1, H2 } from '../primitives';
import { EducationItem } from './EducationItem';
import { ExperienceItem } from './ExperienceItem';
import { Education, Experience } from '@/lib/resume';
import { PersonalReference } from '@/lib/about';
import { usePDF } from 'react-to-pdf';

export function ResumeContent({
    references,
    experienceList,
    education,
}: {
    references: PersonalReference[];
    experienceList: Experience[];
    education: Education[];
}) {
    const { toPDF, targetRef } = usePDF({ filename: 'karim-shehadeh-resume.pdf' });
    return (
        <div className="relative">
            <button className="absolute p-3 bg-slate-950 text-white top-5 right-5" onClick={() => toPDF()}>Download PDF</button>
            <PrintableContent ref={targetRef}>
                <H1>Karim Shehadeh</H1>
                <PersonalReferencesList references={references} />
                <section>
                    <H2>Experience</H2>
                    <ul>
                        {experienceList.map((experience, i) => (
                            <ExperienceItem
                                experience={experience}
                                key={i}
                                {...experience}
                            />
                        ))}
                    </ul>
                </section>
                <section>
                    <H2>Education</H2>
                    <ul>
                        {education.map((education, i) => (
                            <EducationItem
                                education={education}
                                key={i}
                                {...education}
                            />
                        ))}
                    </ul>
                </section>
                <section>
                    <H2>References</H2>
                    <PersonalReferencesList references={references} />
                </section>
            </PrintableContent>
        </div>
    );
}
