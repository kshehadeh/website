import React from "react";
import { Experience } from "@/lib/resume";

export function ExperienceItem({ experience }: { experience: Experience }) {
    return (
        <div className="mt-5 mb-5">
            <h3
                className={
                    'mb-1 text-lg font-bold flex flex-row justify-between'
                }
            >
                <div>{experience?.name}</div>
                <div className={'text-sm font-normal'}>
                    {experience?.start.toFormat('y')}-
                    {experience?.end ? experience.end.toFormat('y') : 'Present'}
                </div>
            </h3>
            <p className={'m-1 flex flex-row'}>
                <div className="mr-2">
                    <img
                        src={experience?.company?.icon}
                        alt={'Icon for experience?.company.title'}
                        className={'w-5 h-5'}
                    />
                </div>
                <div>{experience?.company.title}</div>
            </p>
            <p className={'m-1'}>{experience?.overview}</p>
            <ul className={'ml-10'}>
                {experience?.bullets.map(b => (
                    <li className={'list-square pb-2'} key={b.id}>
                        {b.text}
                    </li>
                ))}
            </ul>
        </div>
    );
}