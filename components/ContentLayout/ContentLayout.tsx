import React from 'react';
import { PropsWithChildren } from 'react';
import { Content } from '../Content';
import Navigation from '../Navigation/Navigation';
import { PageType } from '@/lib/page';
import { Footer } from '../Footer/Footer';
import { cn } from '@/lib/util';

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
    const sidecarContent = sidecar();
    const hasSidecar = sidecarContent !== null;
    const isHomePage = pageType === 'home';
    const isAboutPage = pageType === 'about';

    return (
        <div className={cn(
            "min-h-screen relative z-10",
            !isAboutPage && "bg-background"
        )}>
            <Navigation current={pageType} />
            <div className="flex flex-row pb-24 md:pb-10">
                <div
                    className={cn(
                        hasSidecar ? 'md:w-3/4' : 'w-full',
                        'w-full',
                        !isHomePage && 'mt-5',
                    )}
                >
                    <Content fullHeight={fullHeight} noPadding={isHomePage}>
                        {children}
                    </Content>
                </div>
                {hasSidecar && (
                    <div className="md:w-1/4 md:block mt-5 hidden">
                        {sidecarContent}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
