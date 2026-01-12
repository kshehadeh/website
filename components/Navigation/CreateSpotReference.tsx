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
            className="relative flex items-center transition-all hover:scale-105 group px-2 py-1"
        >
            {/* Gradient glow effect - multiple layers for depth */}
            <div className="absolute inset-0 blur-2xl opacity-40 group-hover:opacity-60 transition-opacity bg-gradient-to-r from-orange-400 via-red-500 to-red-600 rounded-lg -z-10 animate-pulse" />
            <div className="absolute inset-0 blur-lg opacity-50 group-hover:opacity-70 transition-opacity bg-gradient-to-r from-orange-500 via-red-600 to-red-700 rounded-lg -z-10" />

            {/* Image or Text Fallback */}
            <div className="relative z-10 flex items-center">
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
