import React from 'react';
import { BlogPostFull } from '@/lib/blog';
import { notion } from '@/lib/notion';
import { NotionRenderer } from '@/lib/notion-renderer';
import { H1, Img } from '../primitives';

export async function Post({ post }: { post: BlogPostFull }) {
    const renderer = new NotionRenderer({ client: notion });
    const postElements = await renderer.render(...(post?.blocks || []));
    return (
        <>
            <div className="mb-10">
                <H1>{post.title}</H1>
            </div>
            {post.coverUrl && (
                <Img
                    src={post.coverUrl}
                    alt={post.title}
                    additionalClasses={[
                        'hidden md:block md:float-right md:m-5 md:w-[33%]',
                    ]}
                />
            )}
            {postElements}
        </>
    );
}
