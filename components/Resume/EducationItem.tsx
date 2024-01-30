import { Education } from '@/lib/resume';
import React from 'react';

export function EducationItem({ education }: { education: Education }) {
    return (
        <div className="mt-5 mb-5">
            <h3
                className={
                    'mb-1 text-lg font-bold flex flex-row justify-between'
                }
            >
                <div>{education?.degree}</div>
                <div
                className={'text-sm font-normal'}>{education?.graduationDate.toFormat('y')}</div>
            </h3>

            <p>{education?.title}</p>
        </div>
    );
}
