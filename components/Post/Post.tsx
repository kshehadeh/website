import React from 'react';
import { BlogPostFull } from '@/lib/blog';
import { notion } from '@/lib/notion';
import { NotionRenderer } from '@/lib/notion-renderer';
import { Img } from '../primitives';
import { HeadingWithRotatedBg } from '../HeadingWithRotatedBg';

export async function Post({ post }: { post: BlogPostFull }) {
    const renderer = new NotionRenderer({ client: notion });
    const postElements = await renderer.render(...(post?.blocks || []));
    return (
        <>
            <div className="mb-10">
                <HeadingWithRotatedBg 
                    tilted={true}
                    className="text-4xl font-bold text-foreground tracking-tight mb-4 font-mono"
                >
                    {post.title}
                </HeadingWithRotatedBg>
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
