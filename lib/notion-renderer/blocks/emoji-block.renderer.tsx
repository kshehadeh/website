import React from 'react';

import { createBlockRenderer } from '../utils/create-block-renderer';
import { Emoji } from '@/components/primitives';

interface EmojiBlock {
    type: 'emoji';
    emoji: string;
}

export default createBlockRenderer<EmojiBlock>('emoji', async data => (
    <Emoji emoji={data.emoji} />
));
