import React from 'react';
import type { Metadata } from 'next';
import '../globals.css';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';

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
            className={`h-full bg-gray-100 ${GeistSans.variable} ${GeistMono.variable}`}
            lang="en"
        >
            <body className="h-full">{children}</body>
        </html>
    );
}
