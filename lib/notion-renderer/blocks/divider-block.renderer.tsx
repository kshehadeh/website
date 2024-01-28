import React from 'react';
import { DividerBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { createBlockRenderer } from '../utils/create-block-renderer';
import { HR } from '@/components/primitives';

export default createBlockRenderer<DividerBlockObjectResponse>(
    'divider',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async data => <HR key={`hr-${data.id}`} />,
);
