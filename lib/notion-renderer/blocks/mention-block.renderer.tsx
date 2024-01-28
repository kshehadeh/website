import React from 'react';

import { MentionRichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';

import { createBlockRenderer } from '../utils/create-block-renderer';
import { Mention } from '@/components/primitives';

export default createBlockRenderer<MentionRichTextItemResponse>(
    'mention',
    async data => <Mention>${data.plain_text}</Mention>,
);
