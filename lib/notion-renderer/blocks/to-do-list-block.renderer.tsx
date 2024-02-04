import React from 'react';

import { ToDoListBlock } from '../extensions/to-do-list.extension';
import { createBlockRenderer } from '../utils/create-block-renderer';
import { UL } from '@/components/primitives';

export default createBlockRenderer<ToDoListBlock>(
    'to_do_list',
    async (data, renderer) => (
        <UL>{await renderer.render(...data.to_do_list)}</UL>
    ),
);
