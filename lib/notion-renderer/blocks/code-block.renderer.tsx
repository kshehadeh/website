import React from 'react';
import { CodeBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { createBlockRenderer } from '../utils/create-block-renderer';
import { Mermaid } from '@/components/Mermaid';
import { Code } from '@/components/Code';

export default createBlockRenderer<CodeBlockObjectResponse>(
    'code',
    async data => {
        if (data.code.language === 'mermaid') {
            return <Mermaid key={`mermaid-${data.id}`}>{data.code.rich_text[0].plain_text}</Mermaid>;
        } else {
            return (
                <Code
                    key={`code-${data.id}`}
                    language={data.code.language}
                    text={data.code.rich_text[0].plain_text}
                    showLineNumbers={true}
                />
            );
        }
    },
);
