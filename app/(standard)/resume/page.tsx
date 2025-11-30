import ContentLayout from '@/components/ContentLayout/ContentLayout';
import { Sidecar } from '@/components/Sidecar/Sidecar';
import ResumePageWrapper from '@/components/ResumePageWrapper';
import { cacheLife, cacheTag } from 'next/cache';

export async function generateMetadata() {
    'use cache';
    cacheLife({ stale: 3600, revalidate: 3600 });
    cacheTag('resume-page-metadata');

    return {
        title: 'Karim Shehadeh - Resume',
        description:
            "Karim Shehadeh's resume - a software engineer with a passion for web development, cloud computing, and open source.",
        alternates: {
            canonical: '/resume',
        },
    };
}

export default async function ResumePageServer() {
    'use cache';
    cacheLife({ stale: 3600, revalidate: 3600 });
    cacheTag('resume-page');
    return (
        <ContentLayout
            fullHeight={true}
            pageType={'resume'}
            sidecar={() => <Sidecar pageType="resume" />}
        >
            <ResumePageWrapper />
        </ContentLayout>
    );
}
