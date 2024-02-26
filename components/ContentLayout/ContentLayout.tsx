import React from 'react';
import { PropsWithChildren } from 'react';
import { Content } from '../Content';
import Navigation from '../Navigation/Navigation';
import { PageType } from '@/lib/page';

type Props = {
    pageType: PageType;
    sidecar: () => React.ReactNode;
};

export default function ContentLayout({
    children,
    pageType,
    sidecar,
}: PropsWithChildren<Props>) {
    return (
        <>
            <Navigation current={pageType} />
            <div className="flex flex-row">
                <div className="md:w-3/4 w-full mt-5">
                    <Content>{children}</Content>
                </div>
                <div className="md:w-1/4 md:block mt-5 hidden">{sidecar()}</div>
            </div>
        </>
    );
}
