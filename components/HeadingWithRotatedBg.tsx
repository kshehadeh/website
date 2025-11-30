import React from 'react';
import { cn } from '@/lib/util';

interface HeadingWithRotatedBgProps
    extends React.HTMLAttributes<HTMLHeadingElement> {
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    children: React.ReactNode;
    tilted?: boolean;
}

export function HeadingWithRotatedBg({
    as: Component = 'h1',
    children,
    className,
    tilted = true,
    ...props
}: HeadingWithRotatedBgProps) {
    return (
        <Component
            className={cn(
                'heading-with-rotated-bg relative inline-block',
                tilted && 'heading-with-rotated-bg--tilted',
                className,
            )}
            {...props}
        >
            <span className="heading-with-rotated-bg__background" />
            {children}
        </Component>
    );
}
