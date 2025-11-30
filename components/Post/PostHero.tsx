import { BlogPostBrief } from '@/lib/blog';
import React from 'react';
import PostTime from './PostTime';
import { TagList } from '../TagList/TagList';
import Link from 'next/link';
import { HeadingWithRotatedBg } from '../HeadingWithRotatedBg';

export function PostHero({ post }: { post: BlogPostBrief }) {
    return (
        <article className="mb-16 -mx-2 md:-mx-5">
            <div className="relative w-full h-[400px] md:h-[600px] overflow-hidden mb-6">
                <Link href={post.href} className="group block relative w-full h-full">
                    {post.coverUrl ? (
                        <div
                            className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                            style={{ backgroundImage: `url(${post.coverUrl})` }}
                        />
                    ) : (
                        <div className="w-full h-full bg-muted" />
                    )}
                    {/* Overlay with only title at bottom */}
                    <div className="absolute inset-0 flex flex-col justify-end">
                        <div className="p-6 md:p-8">
                            <HeadingWithRotatedBg 
                                as="h2" 
                                className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
                            >
                                {post.title}
                            </HeadingWithRotatedBg>
                        </div>
                    </div>
                </Link>
            </div>
            <div className="space-y-4 px-6 md:px-8">
                <div className="flex items-center gap-x-4">
                    <PostTime post={post} />
                    <TagList tags={post.tags} type={'blog'} />
                </div>
                {post.abstract && (
                    <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
                        {post.abstract}
                    </p>
                )}
            </div>
        </article>
    );
}

