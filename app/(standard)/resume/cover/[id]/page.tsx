import { CoverLetterPage } from '@/components/Resume/CoverLetterPage';
import React from 'react';

export const revalidate = 60 * 60; // 1 hour

export default async function Page({params: {id}}: Readonly<{ params: { id: string } }>) {
    return <CoverLetterPage id={id} />;
}
