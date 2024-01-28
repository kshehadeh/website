import React from 'react';
import { CodeBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { createBlockRenderer } from '../utils/create-block-renderer';
import { Code, Legend, Pre } from '@/components/primitives';

export default createBlockRenderer<CodeBlockObjectResponse>(
    'code',
    async (data, renderer) => {
        const code = await renderer.render(...data.code.rich_text)

        return (
            <div key={`code-block-${data.id}`}>
                <Pre>
                    <Code language={data.code.language}>
                        {code}
                    </Code>
                </Pre>
                {data.code.caption.length > 0 && (
                    <Legend>
                        {await renderer.render(...data.code.caption)}
                    </Legend>
                )}
            </div>
        );
    },
);
