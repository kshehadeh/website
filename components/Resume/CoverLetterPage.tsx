import React from 'react';
import { getCoverLetterPageData } from '@/lib/resume';
import { NotionRenderer } from '@/lib/notion-renderer';
import { isRichTextProperty, notion } from '@/lib/notion';

export async function CoverLetterPage({ id }: { id: string }) {
    const { coverLetter } = await getCoverLetterPageData(id);
    const renderer = new NotionRenderer({ client: notion });
    const postElements = await renderer.render(...(coverLetter.blocks || []));
    const title = isRichTextProperty(coverLetter.properties.Name)
        ? coverLetter.properties.Name.rich_text[0].plain_text
        : 'Cover Letter';

    return (
        <div>
            <h1>{title}</h1>
            {postElements}
        </div>
    );
}
