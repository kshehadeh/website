import ContentLayout from '@/components/ContentLayout/ContentLayout';
import { ResumePage } from '@/components/Resume/ResumePage';
import { Sidecar } from '@/components/Sidecar/Sidecar';
import timeouts from '@/lib/timeouts';
import React from 'react';

export const revalidate = timeouts.resume;

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
