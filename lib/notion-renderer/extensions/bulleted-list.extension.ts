import { BulletedListItemBlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { Block, ExtensionFunc } from '../types';

export type BulletedListBlock = Block<
    'bulleted_list',
    (BulletedListItemBlockObjectResponse & { processed?: boolean })[]
>;

const bulletedListExtension: ExtensionFunc = async blocks => {
    let start = false;
    let items: BulletedListBlock['bulleted_list'] = [];
    const next = [];

    const pushList = () => {
        const firstItem = items[0];
        next.push({
            id: firstItem?.id,
            type: 'bulleted_list',
            bulleted_list: items,
        });

        start = false;
        items = [];
    };

    for (const block of blocks) {
        if ('processed' in block && block.processed) {
            next.push(block);
            continue;
        }

        if (block.type === 'bulleted_list_item') {
            if (!start) start = true;

            items.push({
                ...(block as BulletedListItemBlockObjectResponse),
                processed: true,
            });
        } else if (start) {
            pushList();
            next.push(block);
        } else {
            next.push(block);
        }
    }

    if (start) pushList();

    return next;
};

export default bulletedListExtension;
