import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/util';

export function Tag({ text, url }: { text: string; url: string }) {
    return (
        <a
            href={url}
            className={cn(
                'relative z-10 transition-colors',
                'hover:bg-accent hover:text-accent-foreground',
            )}
        >
            <Badge variant="secondary" className="text-xs font-medium">
                {text}
            </Badge>
        </a>
    );
}
