import ContentLayout from '@/components/ContentLayout/ContentLayout';
import { Sidecar } from '@/components/Sidecar/Sidecar';
import ResumePageWrapper from '@/components/ResumePageWrapper';

export async function generateMetadata() {
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
