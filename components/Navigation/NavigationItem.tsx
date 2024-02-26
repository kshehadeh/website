'use client';
import { cls } from '@/lib/util';
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
            className={cls(
                current
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                'block rounded-md px-3 py-2 text-base font-medium',
            )}
            aria-current={current ? 'page' : undefined}
        >
            {item.name}
        </Disclosure.Button>
    ) : (
        <a
            key={item.name}
            href={item.href}
            className={cls(
                current
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                'rounded-md px-3 py-2 text-sm font-medium',
            )}
            aria-current={current ? 'page' : undefined}
        >
            {item.name}
        </a>
    );
}
