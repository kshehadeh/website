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

export function CreateSpotReference({
    showLabel = false,
}: {
    showLabel?: boolean;
}) {
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const isDark = mounted && (resolvedTheme === 'dark' || theme === 'dark');
    const imageSrc = isDark ? '/createspot-dark.png' : '/createspot-light.png';

    if (showLabel) {
        return (
            <Link
                href="https://create.spot"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open Create Spot"
                className="flex items-center gap-2 rounded-sm px-2 py-1 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
                <Image
                    src={imageSrc}
                    alt=""
                    width={768}
                    height={768}
                    className="h-6 w-6 rounded-[3px]"
                    priority
                />
                <span className="text-sm font-medium text-foreground">
                    CreateSpot
                </span>
            </Link>
        );
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Link
                    href="https://create.spot"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open Create Spot"
                    className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    <Image
                        src={imageSrc}
                        alt=""
                        width={768}
                        height={768}
                        className="h-6 w-6 rounded-[3px]"
                        priority
                    />
                </Link>
            </TooltipTrigger>
            <TooltipContent>
                <p className="font-semibold">CreateSpot</p>
                <p className="text-xs text-muted-foreground">
                    AI creative workspace for generating visual concepts.
                </p>
            </TooltipContent>
        </Tooltip>
    );
}
