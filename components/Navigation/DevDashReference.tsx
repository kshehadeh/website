'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

const DEVDASH_ORIGIN = 'https://devdash.iwonderdesigns.com';

export function DevDashReference({
    showLabel = false,
}: {
    showLabel?: boolean;
}) {
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);
    const [imageError, setImageError] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const isDark = mounted && (resolvedTheme === 'dark' || theme === 'dark');
    const imageSrc = isDark
        ? `${DEVDASH_ORIGIN}/img/icon-white.png`
        : `${DEVDASH_ORIGIN}/img/icon-black.png`;

    if (showLabel) {
        return (
            <Link
                href={DEVDASH_ORIGIN}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open DevDash"
                className="flex items-center gap-2 rounded-sm px-2 py-1 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
                {!imageError ? (
                    <Image
                        src={imageSrc}
                        alt=""
                        width={32}
                        height={32}
                        className="h-6 w-6 rounded-[3px]"
                        priority
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <span className="flex h-6 w-6 items-center justify-center rounded-[3px] text-[10px] font-semibold tracking-tight text-muted-foreground">
                        DD
                    </span>
                )}
                <span className="text-sm font-medium text-foreground">
                    DevDash
                </span>
            </Link>
        );
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Link
                    href={DEVDASH_ORIGIN}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open DevDash"
                    className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    {!imageError ? (
                        <Image
                            src={imageSrc}
                            alt=""
                            width={32}
                            height={32}
                            className="h-6 w-6 rounded-[3px]"
                            priority
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <span className="text-[10px] font-semibold tracking-tight text-muted-foreground">
                            DD
                        </span>
                    )}
                </Link>
            </TooltipTrigger>
            <TooltipContent>
                <p className="font-semibold">DevDash</p>
                <p className="text-xs text-muted-foreground">
                    Personal dashboard for notes, tasks, and project context.
                </p>
            </TooltipContent>
        </Tooltip>
    );
}
