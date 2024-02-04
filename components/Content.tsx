import React from 'react';

export function Content({ children }: React.PropsWithChildren) {
    return (
        <main className="bg-white m-2 p-2 md:m-5 md:p-10 rounded-md">
            {children}
        </main>
    );
}
