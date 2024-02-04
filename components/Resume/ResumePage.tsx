import React from 'react';
import { getPersonalReferences } from '@/lib/about';
import {
    getEducation,
    getExperienceList,
    getResumePageData,
} from '@/lib/resume';
import { notFound } from 'next/navigation';
import { ResumeContent } from './ResumeContent';

export async function ResumePage({
    printerFriendly,
}: {
    printerFriendly: boolean;
}) {
    const { resume, about } = await getResumePageData();

    if (resume && about) {
        const references = await getPersonalReferences(about);
        const experienceList = await getExperienceList(resume);
        const education = await getEducation(resume);

        return (
            <ResumeContent
                {...{ references, experienceList, education, printerFriendly }}
            />
        );
    }
    notFound();
}
