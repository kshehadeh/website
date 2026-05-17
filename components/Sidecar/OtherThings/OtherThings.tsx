import Link from 'next/link';
import React from 'react';
import { ActiveLink } from '../Sidecar';
import { PageType } from '@/lib/page';
import { CollapsibleSidecarCard } from '../CollapsibleSidecarCard';

export function OtherThings({ pageType }: { pageType: PageType }) {
    return (
        <CollapsibleSidecarCard title="Other Things">
            <ul className="list-none">
                <li className="leading-8 flex items-start gap-2">
                    <span className="text-muted-foreground mt-1">→</span>
                    {'blog' === pageType ? (
                        <ActiveLink href="/blog">My Blog</ActiveLink>
                    ) : (
                        <Link
                            href="/blog"
                            className="hover:text-primary transition-colors"
                        >
                            My Blog
                        </Link>
                    )}
                </li>
                <li className="leading-8 flex items-start gap-2">
                    <span className="text-muted-foreground mt-1">→</span>
                    {'resume' === pageType ? (
                        <ActiveLink href="/resume">My Resume</ActiveLink>
                    ) : (
                        <Link
                            href="/resume"
                            className="hover:text-primary transition-colors"
                        >
                            My Resume
                        </Link>
                    )}
                </li>
                <li className="leading-8 flex items-start gap-2">
                    <span className="text-muted-foreground mt-1">→</span>
                    {'about' === pageType ? (
                        <ActiveLink href="/about">About Me</ActiveLink>
                    ) : (
                        <Link
                            href="/about"
                            className="hover:text-primary transition-colors"
                        >
                            About Me
                        </Link>
                    )}
                </li>
            </ul>
        </CollapsibleSidecarCard>
    );
}
