import React from 'react';

import { TextRichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';

import { createBlockRenderer } from '../utils/create-block-renderer';
import { A, Code } from '@/components/primitives';
import { tailWindClassesFromTextAnnotations } from '@/lib/class-builder';

export default createBlockRenderer<TextRichTextItemResponse>(
    'text',
    async data => {
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
            result = (
                <Code language="text" additionalClasses={additionalClasses}>
                    {text}
                </Code>
            );
        } else {
            // Determine where to insert newlines by checking if it starts with a newline
            const renderedText = text.trimEnd().replaceAll('\n', `<br />`);
            result = (
                <span
                    key={`text-${data.plain_text.slice(0, 5)}`}
                    className={additionalClasses.join(' ')}
                    dangerouslySetInnerHTML={{ __html: renderedText }}
                ></span>
            );
        }

        return result;
    },
);
