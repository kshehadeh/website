'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { HeadingWithRotatedBg } from '@/components/HeadingWithRotatedBg';

export function CollapsibleSidecarCard({
    title,
    children,
    defaultOpen = false,
}: {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}) {
    const [isOpen, setIsOpen] = React.useState(defaultOpen);

    return (
        <Card className="mb-4 border-0 shadow-none">
            <CardHeader className="pb-3">
                <button
                    type="button"
                    onClick={() => setIsOpen(open => !open)}
                    aria-expanded={isOpen}
                    className="sidecar-collapsible-trigger w-full flex items-center justify-start text-left"
                >
                    <HeadingWithRotatedBg
                        as="h2"
                        className="text-base font-semibold font-mono"
                    >
                        {title}
                    </HeadingWithRotatedBg>
                </button>
            </CardHeader>
            <div
                className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
                <div className="overflow-hidden">
                    <CardContent className="pt-0">{children}</CardContent>
                </div>
            </div>
        </Card>
    );
}
