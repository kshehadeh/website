'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';

export function MpathReference() {
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Use resolvedTheme to handle system theme preference
    const isDark = mounted && (resolvedTheme === 'dark' || theme === 'dark');
    const imageSrc = isDark
        ? '/mpath-header-dark.png'
        : '/mpath-header-light.png';

    if (!mounted) {
        // Return a placeholder to prevent hydration mismatch
        return (
            <Link
                href="https://mpath.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex items-center transition-all hover:scale-105"
            >
                <div className="relative w-auto h-5 opacity-0">
                    <Image
                        src="/mpath-header-light.png"
                        alt="MPath Project"
                        width={90}
                        height={24}
                        className="h-5 w-auto"
                        priority
                    />
                </div>
            </Link>
        );
    }

    return (
        <Link
            href="https://mpath.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex items-center transition-all hover:scale-105 group px-2 py-1"
        >
            {/* Bluish glow effect - multiple layers for depth */}
            <div className="absolute inset-0 blur-2xl opacity-40 group-hover:opacity-60 transition-opacity bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-lg -z-10 animate-pulse" />
            <div className="absolute inset-0 blur-lg opacity-50 group-hover:opacity-70 transition-opacity bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 rounded-lg -z-10" />

            {/* Image */}
            <div className="relative z-10 flex items-center">
                <Image
                    src={imageSrc}
                    alt="MPath Project"
                    width={90}
                    height={24}
                    className="h-5 w-auto drop-shadow-2xl"
                    priority
                />
            </div>
        </Link>
    );
}
