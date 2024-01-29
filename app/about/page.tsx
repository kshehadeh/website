import React from 'react';
import { H1, H2, HR, Img } from '@/components/primitives';
import { getPersonalReferences } from '@/lib/about';
import {
    fetchPageBlocks,
    isRichTextProperty,
    notion,
} from '@/lib/notion';
import { getAboutPage } from '@/lib/about';
import { NotionRenderer } from '@/lib/notion-renderer';
import PersonalReferencesList from '@/components/About/References';
import { getCoverUrlFromPage } from '@/lib/blog';

export default async function AboutMePage() {
    const page = await getAboutPage();

    const blocks = await fetchPageBlocks(page.id);

    const referencesDb = blocks.find(
        block =>
            block.type === 'child_database' &&
            block.child_database.title === 'References',
    );

    const references = referencesDb ? await getPersonalReferences(referencesDb.id) : [];
    const renderer = new NotionRenderer({ client: notion });
    const postElements = await renderer.render(...(blocks || []));
    const title = isRichTextProperty(page.properties.Name)
        ? page.properties.Name.rich_text[0].plain_text
        : 'About Me';

    const coverUrl = getCoverUrlFromPage(page)

    return (
        <>
            <H1>{title}</H1>
            <div className="">
            {coverUrl && (
                <Img
                    additionalClasses={["float-end", "hidden", "md:block"]}
                    src={coverUrl}
                    alt={`Cover image for ${title}`}
                />
            )}            
            {postElements}
            </div>
            <HR/>
            <H2 additionalClasses={["mb-4"]}>Find Me Here...</H2>
            <PersonalReferencesList references={references}></PersonalReferencesList>
        </>
    );
}
