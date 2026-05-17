import React from 'react';

import { RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';

import { createBlockRenderer } from '../utils/create-block-renderer';
import { A, Code } from '@/components/primitives';
import { tailWindClassesFromTextAnnotations } from '@/lib/class-builder';

function stripWrappingBackticks(value: string): string {
    const trimmed = value.trim();
    const wrappedMatch = trimmed.match(/^`+([\s\S]*?)`+$/);
    return wrappedMatch ? wrappedMatch[1] : value;
}

export default createBlockRenderer<RichTextItemResponse>('text', async data => {
    const text = data.plain_text;
    let result: React.ReactNode = <>{text}</>;

    const additionalClasses = tailWindClassesFromTextAnnotations(
        data.annotations,
    );
    if (data.href) {
        result = (
            <A
                key={`bookmark-${data.plain_text.slice(0, 5)}`}
                href={data.href}
                additionalClasses={additionalClasses}
            >
                {text}
            </A>
        );
    } else if (data.annotations.code) {
        const inlineCodeText = stripWrappingBackticks(text);
        result = (
            <Code language="text" additionalClasses={additionalClasses}>
                {inlineCodeText}
            </Code>
        );
    } else {
        // Determine where to insert newlines by checking if it starts with a newline
        const renderedText = text.replaceAll('\n', `<br />`);
        result = (
            <span
                key={`text-${data.plain_text.slice(0, 5)}`}
                className={additionalClasses.join(' ')}
                dangerouslySetInnerHTML={{ __html: renderedText }}
            ></span>
        );
    }

    return result;
});
