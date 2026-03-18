import React from 'react';
import { BlogPostFull } from '@/lib/blog';
import { notion } from '@/lib/notion';
import { NotionRenderer } from '@/lib/notion-renderer';
import { HeadingWithRotatedBg } from '../HeadingWithRotatedBg';

export async function Post({ post }: { post: BlogPostFull }) {
    const renderer = new NotionRenderer({ client: notion });
    const postElements = await renderer.render(...(post?.blocks || []));
    const hasHero = Boolean(post.coverUrl);

    return (
        <>
            {hasHero ? (
                <div className="relative w-full h-[320px] sm:h-[400px] md:h-[480px] overflow-hidden mb-8">
                    <div
                        className="absolute inset-0 w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${post.coverUrl})` }}
                        role="img"
                        aria-label={post.title}
                    />
                    <div
                        className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent"
                        aria-hidden
                    >
                        <div className="p-6 md:p-8">
                            <HeadingWithRotatedBg
                                tilted={true}
                                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight font-mono drop-shadow-md"
                            >
                                {post.title}
                            </HeadingWithRotatedBg>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mb-10">
                    <HeadingWithRotatedBg
                        tilted={true}
                        className="text-4xl font-bold text-foreground tracking-tight mb-4 font-mono"
                    >
                        {post.title}
                    </HeadingWithRotatedBg>
                </div>
            )}
            <div className="max-w-3xl mx-auto">{postElements}</div>
        </>
    );
}
