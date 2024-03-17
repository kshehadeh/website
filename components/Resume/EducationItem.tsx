import { Education } from '@/lib/resume';
import { DateTime } from 'luxon';
import React from 'react';

export function EducationItem({ education }: { education: Education }) {
    return (
        <div className="mt-5 mb-5">
            <h3
                className={
                    'flex flex-row justify-between'
                }
            >
                <div>{education?.degree}</div>
                <div className={'text-sm font-normal'}>
                    {education?.graduationDate
                        ? DateTime.fromISO(education.graduationDate).toFormat(
                              'y',
                          )
                        : ''}
                </div>
            </h3>

            <p>{education?.title}</p>
        </div>
    );
}
