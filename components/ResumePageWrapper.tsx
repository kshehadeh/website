'use client';

import dynamic from 'next/dynamic';

const DynamicResumePage = dynamic(() => import('@/components/ResumePage'), {
    ssr: false,
});

export default function ResumePageWrapper() {
    return <DynamicResumePage />;
}

