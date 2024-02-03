import React from 'react';

export default React.forwardRef(function PrintableContent ({ children }: React.PropsWithChildren, ref: React.Ref<HTMLDivElement>) {
    return <main ref={ref} className="bg-white p-10">{children}</main>;
})
