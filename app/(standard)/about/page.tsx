import React, { cache } from 'react';
import { H1, H2, HR } from '@/components/primitives';
import { getPersonalReferences } from '@/lib/about';
import { isRichTextProperty, notion } from '@/lib/notion';
import { getAboutPage } from '@/lib/about';
import { NotionRenderer } from '@/lib/notion-renderer';
import PersonalReferencesList from '@/components/About/References';
import timeouts from '@/lib/timeouts';
import { Cover } from '@/components/Cover.server';
import ContentLayout from '@/components/ContentLayout/ContentLayout';
import { Sidecar } from '@/components/Sidecar/Sidecar';

export const revalidate = timeouts.about;

const getPageData = cache(async () => {
    const page = await getAboutPage();
    return { page };
});


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
    const { page } = await getPageData();
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
            <H1>{title}</H1>
            <div className="">
                <Cover page={page} />
                {postElements}
            </div>
            <HR />
            <H2 additionalClasses={['mb-4']}>Find Me Here...</H2>
            <PersonalReferencesList
                references={references}
            ></PersonalReferencesList>
        </ContentLayout>
    );
}
