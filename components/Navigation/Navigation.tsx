'use client';
import React from 'react';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import NavigationItem from './NavigationItem';
import { DocSearch } from '@docsearch/react';
import '@docsearch/css';

const user = {
    name: 'Karim Shehadeh',
    email: 'karim@karim.cloud',
    imageUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
};
const navigation = [
    { name: 'Blog', href: '/blog' },
    { name: 'Bookmarks', href: '/bookmarks' },
    { name: 'About', href: '/about' },
    { name: 'Resume', href: '/resume' },
];

export default function Navigation() {
    return (
        <Disclosure as="nav" className="bg-gray-800">
            {({ open }) => (
                <>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <div className="flex items-center">
                                <a
                                    className="flex-shrink-0 text-gray-800 weight-100 bg-white p-2 rounded-sm"
                                    href="/"
                                >
                                    {user.name}
                                </a>
                                <div className="hidden md:block">
                                    <div className="ml-10 flex items-baseline space-x-4">
                                        {navigation.map(item => (
                                            <NavigationItem
                                                key={item.href}
                                                item={item}
                                                mobile={false}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-row">
                                <DocSearch
                                    appId={
                                        process.env
                                            .NEXT_PUBLIC_ALGOLIA_APP_ID || ''
                                    }
                                    indexName={
                                        process.env
                                            .NEXT_PUBLIC_ALGOLIA_INDEX_NAME ||
                                        ''
                                    }
                                    apiKey={
                                        process.env
                                            .NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY ||
                                        ''
                                    }

                                    placeholder='Search...'
                                />

                                <div className="-mr-2 flex md:hidden">
                                    {/* Mobile menu button */}
                                    <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
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

                    <Disclosure.Panel className="md:hidden">
                        <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                            {navigation.map(item => (
                                <NavigationItem
                                    item={item}
                                    mobile={true}
                                    key={item.href}
                                />
                            ))}
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    );
}
