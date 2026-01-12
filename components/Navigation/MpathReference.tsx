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
            className="relative flex items-center transition-all hover:scale-105"
        >
            {/* Image */}
            <div className="relative flex items-center">
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
