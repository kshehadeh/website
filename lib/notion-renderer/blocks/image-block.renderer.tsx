import React from 'react';

import { ImageBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { createBlockRenderer } from '../utils/create-block-renderer';
import { Figure, Legend } from '@/components/primitives';

export default createBlockRenderer<ImageBlockObjectResponse>(
    'image',
    async (data, renderer) => {
        const src =
            'file' in data.image
                ? data.image.file.url
                : data.image.external.url;

        return (
            <Figure>
                <img src={`${src}`} />$
                {data.image.caption.length > 0 ? (
                    <Legend>
                        ${await renderer.render(...data.image.caption)}
                    </Legend>
                ) : (
                    <></>
                )}
            </Figure>
        );
    },
);
