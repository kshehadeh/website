'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';

export function CreateSpotReference() {
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);
    const [imageError, setImageError] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Use resolvedTheme to handle system theme preference
    const isDark = mounted && (resolvedTheme === 'dark' || theme === 'dark');
    const imageSrc = isDark
        ? '/create-spot-dark-mode.png'
        : '/create-spot-light-mode.png';

    if (!mounted) {
        // Return a placeholder to prevent hydration mismatch
        return (
            <Link
                href="https://create.spot"
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex items-center transition-all hover:scale-105"
            >
                <div className="relative w-auto h-6 opacity-0">
                    <Image
                        src="/create-spot-light-mode.png"
                        alt="Create Spot"
                        width={108}
                        height={29}
                        className="h-6 w-auto"
                        priority
                    />
                </div>
            </Link>
        );
    }

    return (
        <Link
            href="https://create.spot"
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex items-center transition-all hover:scale-105"
        >
            {/* Image or Text Fallback */}
            <div className="relative flex items-center">
                {!imageError ? (
                    <Image
                        src={imageSrc}
                        alt="Create Spot"
                        width={108}
                        height={29}
                        className="h-6 w-auto drop-shadow-2xl"
                        priority
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <span className="text-sm font-semibold text-foreground drop-shadow-2xl">
                        Create Spot
                    </span>
                )}
            </div>
        </Link>
    );
}
