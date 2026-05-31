'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

const TOBY_ORIGIN = 'https://toby.iwonderdesigns.com';

export function TobyReference({ showLabel = false }: { showLabel?: boolean }) {
    const [imageError, setImageError] = React.useState(false);

    if (showLabel) {
        return (
            <Link
                href={TOBY_ORIGIN}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open Toby"
                className="flex items-center gap-2 rounded-sm px-2 py-1 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
                {!imageError ? (
                    <Image
                        src="/toby.png"
                        alt=""
                        width={64}
                        height={64}
                        className="h-6 w-6 rounded-[3px]"
                        priority
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <span className="flex h-6 w-6 items-center justify-center rounded-[3px] text-[10px] font-semibold tracking-tight text-muted-foreground">
                        TB
                    </span>
                )}
                <span className="text-sm font-medium text-foreground">Toby</span>
            </Link>
        );
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Link
                    href={TOBY_ORIGIN}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open Toby"
                    className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    {!imageError ? (
                        <Image
                            src="/toby.png"
                            alt=""
                            width={64}
                            height={64}
                            className="h-6 w-6 rounded-[3px]"
                            priority
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <span className="text-[10px] font-semibold tracking-tight text-muted-foreground">
                            TB
                        </span>
                    )}
                </Link>
            </TooltipTrigger>
            <TooltipContent>
                <p className="font-semibold">Toby</p>
                <p className="text-xs text-muted-foreground">
                    CLI assistant for organizing work across integrations.
                </p>
            </TooltipContent>
        </Tooltip>
    );
}
