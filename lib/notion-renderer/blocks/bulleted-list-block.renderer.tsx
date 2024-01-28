import React from 'react';

import { BulletedListBlock } from '../extensions/bulleted-list.extension';
import { createBlockRenderer } from '../utils/create-block-renderer';
import { UL } from '@/components/primitives';

export default createBlockRenderer<BulletedListBlock>(
    'bulleted_list',
    async (data, renderer) => {
        return <UL key={`ul-${data.id}`}>{await renderer.render(...data.bulleted_list)}</UL>;
    },
);
