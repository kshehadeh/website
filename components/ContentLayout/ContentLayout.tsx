import React from 'react';
import { PropsWithChildren } from 'react';
import { Content } from '../Content';
import Navigation from '../Navigation/Navigation';
import { PageType } from '@/lib/page';
import { Footer } from '../Footer/Footer';

type Props = {
    fullHeight?: boolean;
    pageType: PageType;
    sidecar: () => React.ReactNode;
};

export default function ContentLayout({
    fullHeight,
    children,
    pageType,
    sidecar,
}: PropsWithChildren<Props>) {
    return (
        <>
            <Navigation current={pageType} />
            <div className="flex flex-row pb-24 md:pb-10">
                <div className="md:w-3/4 w-full mt-5">
                    <Content fullHeight={fullHeight}>{children}</Content>
                </div>
                <div className="md:w-1/4 md:block mt-5 hidden">{sidecar()}</div>
            </div>
            <Footer />
        </>
    );
}
