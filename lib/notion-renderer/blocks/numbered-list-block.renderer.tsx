import React from 'react';

import { NumberedListblock } from '../extensions/numbered-list.extension';
import { createBlockRenderer } from '../utils/create-block-renderer';
import { OL } from '@/components/primitives';

export default createBlockRenderer<NumberedListblock>(
    'numbered_list',
    async (data, renderer) => {
        return <OL key={`ol-${data.id}`}>{await renderer.render(...data.numbered_list)}</OL>;
    },
);
