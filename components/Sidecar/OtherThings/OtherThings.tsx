import Link from 'next/link';
import React from 'react';
import { ActiveLink } from '../Sidecar';
import { PageType } from '@/lib/page';

export function OtherThings({ pageType }: { pageType: PageType }) {
    return (
        <aside>
            <h2>Other Things</h2>
            <ul>
                <li className="leading-8">
                    {'blog' === pageType ? (
                        <ActiveLink href="/blog">My Blog</ActiveLink>
                    ) : (
                        <Link href="/blog">My Blog</Link>
                    )}
                </li>
                <li className="leading-8">
                    {'resume' === pageType ? (
                        <ActiveLink href="/resume">My Resume</ActiveLink>
                    ) : (
                        <Link href="/resume">My Resume</Link>
                    )}
                </li>
                <li className="leading-8">
                    {'about' === pageType ? (
                        <ActiveLink href="/about">About Me</ActiveLink>
                    ) : (
                        <Link href="/about">About Me</Link>
                    )}
                </li>
            </ul>
        </aside>
    );
}
