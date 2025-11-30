'use client';

import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/util';

interface HeadingWithRotatedBgProps
    extends React.HTMLAttributes<HTMLHeadingElement> {
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    children: React.ReactNode;
}

export function HeadingWithRotatedBg({
    as: Component = 'h1',
    children,
    className,
    ...props
}: HeadingWithRotatedBgProps) {
    // Start with minimal rotation to avoid flash on prerendered pages
    const [rotation, setRotation] = useState(-2);
    const { resolvedTheme } = useTheme();

    const nodeRef = React.useRef<HTMLHeadingElement | null>(null);

    const calculateRotation = React.useCallback(() => {
        if (nodeRef.current) {
            const text = nodeRef.current.textContent || '';
            const length = text.length;
            // Maximum rotation is 20 degrees, decreases proportionally with length
            // Formula: rotation = 20 * (1 - min(length / 100, 0.9))
            // This gives: 20deg for very short, decreasing to ~2deg for very long
            const maxLength = 100; // At 100 chars, rotation is minimal
            const ratio = Math.min(length / maxLength, 0.9);
            const calculatedRotation = -20 * (1 - ratio);
            setRotation(Math.max(calculatedRotation, -2)); // Minimum of 2 degrees
        }
    }, []);

    const headingRef = React.useCallback((node: HTMLHeadingElement | null) => {
        nodeRef.current = node;
        if (node) {
            calculateRotation();
        }
    }, [calculateRotation]);

    // Recalculate when children change
    React.useEffect(() => {
        calculateRotation();
    }, [children, calculateRotation]);

    // Determine background and text colors based on theme
    // Dark mode: black text on white background
    // Light mode: white text on black background
    const bgColor =
        resolvedTheme === 'dark'
            ? '#ffffff' // White background in dark mode
            : resolvedTheme === 'light'
              ? '#000000' // Black background in light mode
              : '#ffffff'; // Default to dark mode (white background)

    const textColor =
        resolvedTheme === 'dark'
            ? '#000000' // Black text in dark mode
            : resolvedTheme === 'light'
              ? '#ffffff' // White text in light mode
              : '#000000'; // Default to dark mode (black text)

    return (
        <Component
            ref={headingRef}
            className={cn('relative inline-block', className)}
            style={
                {
                    '--rotation': `${rotation}deg`,
                    zIndex: 1,
                    color: textColor,
                } as React.CSSProperties
            }
            {...props}
        >
            <span
                className="absolute -z-10 rounded-sm transition-transform duration-500 ease-out"
                style={{
                    top: '-0.25rem',
                    left: '-0.5rem',
                    right: '-0.5rem',
                    bottom: '-0.25rem',
                    transform: `rotate(var(--rotation)) scale(1.3)`,
                    backgroundColor: bgColor,
                }}
            />
            {children}
        </Component>
    );
}

