import React from 'react';

export default React.forwardRef(function PrintableContent(
    { children }: React.PropsWithChildren,
    ref: React.Ref<HTMLDivElement>,
) {
    return (
        <div ref={ref} className="bg-white">
            {children}
        </div>
    );
});
