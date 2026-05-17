'use client';

import { useState } from 'react';
import { cn } from '@/lib/util';

export function NotionImage({
    src,
    alt,
    className,
    width,
    height,
}: {
    src: string;
    alt: string;
    className?: string;
    width: number;
    height: number;
}) {
    const [loaded, setLoaded] = useState(false);

    return (
        <div className="relative overflow-hidden rounded-lg">
            {!loaded ? (
                <div className="absolute inset-0 animate-pulse bg-muted" />
            ) : null}
            <img
                src={src}
                alt={alt}
                width={width}
                height={height}
                className={cn(
                    'block transition-opacity duration-200',
                    loaded ? 'opacity-100' : 'opacity-0',
                    className,
                )}
                onLoad={() => setLoaded(true)}
            />
        </div>
    );
}
