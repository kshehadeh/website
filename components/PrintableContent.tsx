import React from 'react';

export default React.forwardRef(function PrintableContent(
    { children, className }: React.PropsWithChildren<{ className?: string }>,
    ref: React.Ref<HTMLDivElement>,    
) {
    return (
        <div ref={ref} className={`${className || ''} bg-white`}>
            {children}
        </div>
    );
});
