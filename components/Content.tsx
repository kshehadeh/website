import React from 'react';

export function Content({ children }: React.PropsWithChildren) {
    return (
        <main className="bg-white md:ml-5 md:mr-5 md:pl-10 md:pr-10 rounded-md">
            {children}
        </main>
    );
}
