import React from 'react';

export function Content({
    fullHeight,
    children,
}: React.PropsWithChildren<{ fullHeight?: boolean }>) {
    return (
        <main
            className={`prose max-w-none bg-white md:ml-5 md:mr-5 md:pl-10 md:pr-10 rounded-md ml-2 pl-2 mr-2 pr-2 pb-6 ${fullHeight ? 'h-full' : ''}`}
        >
            {children}
        </main>
    );
}
