import React from 'react';

import { ImageBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { createBlockRenderer } from '../utils/create-block-renderer';
import { Figure, Legend } from '@/components/primitives';
import { getFinalFileUrl } from '@/lib/notion';

export default createBlockRenderer<ImageBlockObjectResponse>(
    'image',
    async (data, renderer) => {
        const src = await getFinalFileUrl(data.image, data.id);
        return (
            <Figure
                key={`figure-${data.id}`}
                additionalClasses={['block', 'md:m-5']}
            >
                <img
                    src={src}
                    alt={data.image.caption?.[0]?.plain_text || 'src'}
                    className="md:w-[33%]"
                />
                {data.image.caption.length > 0 ? (
                    <Legend additionalClasses={['text-sm mt-3']}>
                        {await renderer.render(...data.image.caption)}
                    </Legend>
                ) : (
                    <></>
                )}
            </Figure>
        );
    },
);
