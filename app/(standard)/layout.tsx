import React from 'react';
import type { Metadata } from 'next';
import '../globals.css';
import Navigation from '@/components/Navigation/Navigation';
import { Content } from '@/components/Content';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import { Sidecar } from '@/components/Sidecar/Sidecar';

export const metadata: Metadata = {
    title: 'Karim Shehadeh',
    description: "Karim Shehadeh's personal website and blog.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            className={`h-full ${GeistSans.variable} ${GeistMono.variable}`}
            lang="en"
        >
            <body className="h-full">
                <div className="min-h-full">
                    <Navigation />
                    <div className="flex flex-row">
                        <div className="md:w-3/4 w-full">
                            <Content>{children}</Content>
                        </div>
                        <div className="md:w-1/4 md:block border-l border-l-slate-100 mt-10 hidden">
                            <Sidecar currentPostSlug="home" />
                        </div>
                    </div>
                    <SpeedInsights />
                    <Analytics />
                </div>
            </body>
        </html>
    );
}
