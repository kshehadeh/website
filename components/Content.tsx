import React from 'react';
import { cn } from '@/lib/util';

export function Content({
    fullHeight,
    children,
    noPadding,
}: React.PropsWithChildren<{ fullHeight?: boolean; noPadding?: boolean }>) {
    return (
        <main
            className={cn(
                'prose prose-slate dark:prose-invert max-w-none pb-6',
                noPadding
                    ? ''
                    : 'md:ml-5 md:mr-5 md:pl-10 md:pr-10 ml-2 pl-2 mr-2 pr-2',
                fullHeight ? 'h-full' : '',
            )}
        >
            {children}
        </main>
    );
}
