import React from 'react';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { Img } from './primitives';
import { getCoverUrlFromPage } from '@/lib/blog';
import { isRichTextProperty } from '@/lib/notion';

export async function Cover({ page }: { page: PageObjectResponse }) {
    const coverUrl = await getCoverUrlFromPage(page);
    const title = isRichTextProperty(page.properties.Name)
        ? page.properties.Name.rich_text[0].plain_text
        : 'About Me';
    return (
        <>
            {coverUrl && (
                <Img
                    additionalClasses={['float-end', 'hidden', 'md:block']}
                    src={coverUrl}
                    alt={`Cover: ${title}`}
                />
            )}
        </>
    );
}
