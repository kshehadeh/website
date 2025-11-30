import { HR } from '@/components/primitives';
import { getPersonalReferences } from '@/lib/about';
import { isRichTextProperty, notion } from '@/lib/notion';
import { getAboutPage } from '@/lib/about';
import { NotionRenderer } from '@/lib/notion-renderer';
import PersonalReferencesList from '@/components/About/References';
import { Cover } from '@/components/Cover.server';
import ContentLayout from '@/components/ContentLayout/ContentLayout';
import { Sidecar } from '@/components/Sidecar/Sidecar';
import { HeadingWithRotatedBg } from '@/components/HeadingWithRotatedBg';
import { cacheLife, cacheTag } from 'next/cache';

export async function generateMetadata() {
    return {
        title: `Karim Shehadeh - About Me`,
        description: `A little bit about Karim Shehadeh and his journey.`,
        alternates: {
            canonical: `/about`,
        },
    };
}

export default async function AboutMePage() {
    'use cache';
    cacheLife({ stale: 3600, revalidate: 3600 });
    cacheTag('about-page');
    
    const page = await getAboutPage();
    const references = page ? await getPersonalReferences(page) : [];
    const renderer = new NotionRenderer({ client: notion });
    const postElements = await renderer.render(...(page.blocks || []));
    const title = isRichTextProperty(page.properties.Name)
        ? page.properties.Name.rich_text[0].plain_text
        : 'About Me';

    return (
        <ContentLayout
            pageType={'about'}
            sidecar={() => <Sidecar pageType="about" />}
        >
            <HeadingWithRotatedBg>{title}</HeadingWithRotatedBg>
            <div className="">
                <Cover page={page} />
                {postElements}
            </div>
            <HR />
            <HeadingWithRotatedBg as="h2">Find Me Here...</HeadingWithRotatedBg>
            <PersonalReferencesList
                references={references}
            ></PersonalReferencesList>
        </ContentLayout>
    );
}
