import React from 'react';
import type { Metadata } from 'next';
import '../globals.css';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from '@/components/theme-provider';

export const maxDuration = 60;

export const metadata: Metadata = {
    title: "Karim Shehadeh's Personal Site",
    description:
        "Karim Shehadeh's personal website that includes a blog, links I have come across, resume and some helpful tooling.",
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
            suppressHydrationWarning
        >
            <body className="h-full">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange
                >
                    <div className="min-h-full">
                        {children}
                        <SpeedInsights />
                        <Analytics />
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}
