'use client';

import React, { useCallback, useRef } from 'react';
import PersonalReferencesList from '../About/References';
import PrintableContent from '../PrintableContent';
import { EducationItem } from './EducationItem';
import { ExperienceItem } from './ExperienceItem';
import { Education, Experience } from '@/lib/resume';
import { PersonalReference } from '@/lib/about';
import { toPng } from 'html-to-image';
import { FiPrinter } from 'react-icons/fi';
import { FaDownload } from 'react-icons/fa';

export function ResumeContent({
    references,
    experienceList,
    education,
    printerFriendly,
}: {
    references: PersonalReference[];
    experienceList: Experience[];
    education: Education[];
    printerFriendly: boolean;
}) {
    const targetRef = useRef<HTMLDivElement>(null);
    const [downloading, setDownloading] = React.useState(false);

    const onDownloadPdf = useCallback(() => {
        if (targetRef.current === null) {
            return;
        }

        setDownloading(true);

        // relinguish control to allow the render to happen
        setTimeout(() => {
            if (!targetRef.current) return;
            toPng(targetRef.current, { cacheBust: true })
                .then((dataUrl: string) => {
                    const link = document.createElement('a');
                    link.download = 'karim-shehadeh-resume.png';
                    link.href = dataUrl;
                    link.click();
                })
                .catch((err: Error) => {
                    console.log(err);
                })
                .finally(() => {
                    setDownloading(false);
                });
        }, 0);
    }, [targetRef]);

    return (
        <div className="relative">
            {!printerFriendly && (
                <div className="absolute top-1 right-5 flex-row gap-2 hidden md:flex">
                    <a
                        href="/print/resume"
                        className="flex flex-row gap-2  content-center  bg-slate-800 text-white px-3 py-1 rounded-sm"
                    >
                        <FiPrinter className="self-center" />
                        <div>Print</div>
                    </a>
                    <button
                        className={`flex flex-row gap-1 bg-slate-800 ${downloading ? 'text-slate-200' : 'text-white'} px-3 py-1 rounded-sm`}
                        onClick={onDownloadPdf}
                        disabled={downloading}
                    >
                        <FaDownload className="self-center" />
                        <span
                            className={downloading ? 'invisible absolute' : ''}
                        >
                            Download
                        </span>
                        {downloading && <span>Downloading...</span>}
                    </button>
                </div>
            )}
            <PrintableContent ref={targetRef} className={'m-4'}>
                <h1>Karim Shehadeh</h1>
                <PersonalReferencesList references={references} />
                <section>
                    <h2>Experience</h2>
                    <ul className="ml-0 pl-0">
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
                    <h2>Education</h2>
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
                    <h2>References</h2>
                    <PersonalReferencesList references={references} />
                </section>
            </PrintableContent>
        </div>
    );
}
