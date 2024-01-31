import React from 'react';
import { BlogPostFull } from '@/lib/blog';
import { notion } from '@/lib/notion';
import { NotionRenderer } from '@/lib/notion-renderer';
import { H1, Img } from '../primitives';
import { Author } from './Author';

export async function Post({ post }: { post: BlogPostFull }) {
    const renderer = new NotionRenderer({ client: notion });
    const postElements = await renderer.render(...(post?.blocks || []));
    return (
        <>
            <div className="mb-10">
                <H1>{post.title}</H1>
                <Author post={post}></Author>
            </div>            
            {post.coverUrl && <Img src={post.coverUrl} alt={post.title} additionalClasses={["md:float-right md:m-5 md:w-[33%]"]}/>}
            {postElements}
        </>
    );
}
