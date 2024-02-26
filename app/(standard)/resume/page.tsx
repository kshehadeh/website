import ContentLayout from '@/components/ContentLayout/ContentLayout';
import { ResumePage } from '@/components/Resume/ResumePage';
import { Sidecar } from '@/components/Sidecar/Sidecar';
import timeouts from '@/lib/timeouts';
import React from 'react';

export const revalidate = timeouts.resume;

export async function generateMetadata() {
    return {
        title: 'Karim Shehadeh - Resume',
        description: "Karim Shehadeh's resume - a software engineer with a passion for web development, cloud computing, and open source.",
        alternates: {
            canonical: '/resume',
        },
    };
}

export default async function Page() {
    return (
        <ContentLayout
            pageType={'resume'}
            sidecar={() => <Sidecar pageType="resume" />}
        >
            <ResumePage printerFriendly={false} />;
        </ContentLayout>
    );
}
