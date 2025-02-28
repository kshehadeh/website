import React, { cache } from 'react';
import { HR } from '@/components/primitives';
import { getPersonalReferences } from '@/lib/about';
import { isRichTextProperty, notion } from '@/lib/notion';
import { getAboutPage } from '@/lib/about';
import { NotionRenderer } from '@/lib/notion-renderer';
import PersonalReferencesList from '@/components/About/References';
import { Cover } from '@/components/Cover.server';
import ContentLayout from '@/components/ContentLayout/ContentLayout';
import { Sidecar } from '@/components/Sidecar/Sidecar';

export const maxDuration = 60;
export const revalidate = 3600;

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
            <h1>{title}</h1>
            <div className="">
                <Cover page={page} />
                {postElements}
            </div>
            <HR />
            <h2>Find Me Here...</h2>
            <PersonalReferencesList
                references={references}
            ></PersonalReferencesList>
        </ContentLayout>
    );
}
