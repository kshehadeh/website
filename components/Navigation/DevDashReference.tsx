'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';

const DEVDASH_ORIGIN = 'https://devdash.iwonderdesigns.com';

export function DevDashReference() {
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
    const lightPlaceholder = `${DEVDASH_ORIGIN}/img/icon-black.png`;

    const linkClass =
        'relative flex items-center gap-2 transition-all hover:scale-105 shrink-0';
    const labelClass =
        'text-sm font-semibold text-foreground drop-shadow-2xl whitespace-nowrap';

    if (!mounted) {
        return (
            <Link
                href={DEVDASH_ORIGIN}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
            >
                <div
                    className="relative h-6 w-auto opacity-0 shrink-0"
                    aria-hidden
                >
                    <Image
                        src={lightPlaceholder}
                        alt=""
                        width={32}
                        height={32}
                        className="h-6 w-auto"
                        priority
                    />
                </div>
                <span className={labelClass}>DevDash</span>
            </Link>
        );
    }

    return (
        <Link
            href={DEVDASH_ORIGIN}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
        >
            {!imageError ? (
                <>
                    <Image
                        src={imageSrc}
                        alt=""
                        width={32}
                        height={32}
                        className="h-6 w-auto shrink-0 drop-shadow-2xl"
                        priority
                        onError={() => setImageError(true)}
                    />
                    <span className={labelClass}>DevDash</span>
                </>
            ) : (
                <span className={labelClass}>DevDash</span>
            )}
        </Link>
    );
}
