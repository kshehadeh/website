import React from 'react';

export function Content({ children }: React.PropsWithChildren) {
    return <main className="bg-white m-5 p-10 rounded-md">{children}</main>;
}
