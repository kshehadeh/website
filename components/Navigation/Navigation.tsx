'use client';
import React from 'react';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import NavigationItem from './NavigationItem';
import { PageType } from '@/lib/page';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { MpathReference } from './MpathReference';
import { CreateSpotReference } from './CreateSpotReference';

const user = {
    name: 'Karim Shehadeh',
    email: 'karim@karim.cloud',
    imageUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
};
const navigation = [
    { name: 'Blog', href: '/blog', type: 'blog' },
    { name: 'Bookmarks', href: '/bookmarks', type: 'bookmarks' },
    { name: 'About', href: '/about', type: 'about' },
    { name: 'Resume', href: '/resume', type: 'resume' },
];

export default function Navigation({ current }: { current: PageType }) {
    return (
        <Disclosure as="nav" className="border-b border-border bg-background">
            {({ open }) => (
                <>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <div className="flex items-center">
                                <Link
                                    className="flex-shrink-0 font-semibold text-foreground bg-card border border-border p-2 rounded-sm hover:bg-accent transition-colors font-mono"
                                    href="/"
                                >
                                    {user.name}
                                </Link>
                                <div className="hidden md:block">
                                    <div className="ml-10 flex items-center space-x-4">
                                        {navigation.map(item => (
                                            <NavigationItem
                                                key={item.href}
                                                item={item}
                                                mobile={false}
                                                current={current === item.type}
                                            />
                                        ))}
                                        <MpathReference />
                                        <CreateSpotReference />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-row gap-3 items-center">
                                <ThemeToggle />
                                <div className="-mr-2 flex md:hidden">
                                    {/* Mobile menu button */}
                                    <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                                        <span className="absolute -inset-0.5" />
                                        <span className="sr-only">
                                            Open main menu
                                        </span>
                                        {open ? (
                                            <XMarkIcon
                                                className="block h-6 w-6"
                                                aria-hidden="true"
                                            />
                                        ) : (
                                            <Bars3Icon
                                                className="block h-6 w-6"
                                                aria-hidden="true"
                                            />
                                        )}
                                    </Disclosure.Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Disclosure.Panel className="md:hidden border-t border-border">
                        <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                            {navigation.map(item => (
                                <NavigationItem
                                    item={item}
                                    mobile={true}
                                    key={item.href}
                                    current={current === item.type}
                                />
                            ))}
                            <div className="px-3 py-2 flex items-center gap-2">
                                <MpathReference />
                                <CreateSpotReference />
                            </div>
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    );
}
