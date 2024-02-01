import React from 'react';
import {
    getEducation,
    getExperienceList,
    getResumePage,
} from '@/lib/resume';
import { notFound } from 'next/navigation';
import { H1, H2 } from '@/components/primitives';
import PersonalReferencesList from '@/components/About/References';
import { getAboutPage, getPersonalReferences } from '@/lib/about';
import { EducationItem } from '@/components/Resume/EducationItem';
import { ExperienceItem } from '@/components/Resume/ExperienceItem';


export const revalidate = 60 * 60; // 1 hour

export default async function ResumePage() {
    const resume = await getResumePage();
    const about = await getAboutPage();

    if (resume && about) {
        const references = await getPersonalReferences(about);
        const experienceList = await getExperienceList(resume);
        const education = await getEducation(resume);

        return (
            <>
                <H1 additionalClasses={['mb-3']}>Karim Shehadeh</H1>
                <PersonalReferencesList references={references}></PersonalReferencesList>
                <div>
                    <H2 additionalClasses={["bg-black", "text-white", "p-2"]}>Experience</H2>
                    {experienceList.map(e => (
                        <ExperienceItem key={e.id} experience={e} />
                    ))}
                </div>

                <div>
                    <H2 additionalClasses={["bg-black", "text-white", "p-2"]}>Education</H2>
                    {education.map(e => (
                        <EducationItem key={e.id} education={e} />
                    ))}
                </div>
            </>
        );
    } else {
        notFound();
    }
}
