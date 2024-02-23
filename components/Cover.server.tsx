import React from 'react';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { getCoverUrlFromPage } from '@/lib/blog';
import { isRichTextProperty } from '@/lib/notion';
import Image from 'next/image';

export async function Cover({ page }: { page: PageObjectResponse }) {
    const coverUrl = await getCoverUrlFromPage(page);
    const title = isRichTextProperty(page.properties.Name)
        ? page.properties.Name.rich_text[0].plain_text
        : 'About Me';
    return (
        <>
            {coverUrl && (
                <Image
                    className={['float-end', 'hidden', 'md:block', 'md:ml-10', 'border-2'].join(' ')}
                    src={coverUrl}
                    alt={`Cover: ${title}`}
                    width={300}
                    height={300}
                />
            )}
        </>
    );
}
