'use client';
import { cn } from '@/lib/util';
import { Disclosure } from '@headlessui/react';
import React from 'react';

export default function NavigationItem({
    item,
    mobile,
    current,
}: Readonly<{
    item: { name: string; href: string };
    mobile: boolean;
    current: boolean;
}>) {
    return mobile ? (
        <Disclosure.Button
            key={item.name}
            as="a"
            href={item.href}
            className={cn(
                current
                    ? 'bg-accent text-accent-foreground font-medium'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                'block rounded-md px-3 py-2 text-base font-medium transition-colors font-mono text-left',
            )}
            aria-current={current ? 'page' : undefined}
        >
            {item.name}
        </Disclosure.Button>
    ) : (
        <a
            key={item.name}
            href={item.href}
            className={cn(
                current
                    ? 'bg-accent text-accent-foreground font-medium'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                'rounded-md px-3 py-2 text-sm font-medium transition-colors font-mono text-left',
            )}
            aria-current={current ? 'page' : undefined}
        >
            {item.name}
        </a>
    );
}
