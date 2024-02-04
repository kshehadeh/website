import { BlogPostBrief } from '@/lib/blog';
import React from 'react';
import PostTime from './PostTime';
import { Author } from './Author';

export interface PostBriefViewOptions {
    hideAbstract?: boolean;
    hideAuthor?: boolean;
    hideDate?: boolean;
    hideTags?: boolean;
}

export function PostBrief({
    post,
    hideAbstract = false,
    hideAuthor = false,
    hideDate = false,
    hideTags = false,
}: {
    post: BlogPostBrief;
} & PostBriefViewOptions) {
    return (
        <article key={post.id} className="flex flex-col justify-between">
            <div
                className="h-32 grow bg-cover hidden md:block"
                style={{ backgroundImage: `url(${post.coverUrl})` }}
            />
            <div className="group relative">
                <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                    <a href={post.href}>
                        <span className="absolute inset-0" />
                        {post.title}
                    </a>
                </h3>

                <div className="flex items-center gap-x-4 text-xs">
                    {!hideDate && <PostTime post={post} />}
                    {!hideTags &&
                        post.tags.map(tag => (
                            <a
                                key={`${post.id}-${tag}-tag`}
                                href={`/blog/tag/${tag}`}
                                className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
                            >
                                {tag}
                            </a>
                        ))}
                </div>

                {!hideAbstract && (
                    <p className="mt-5 line-clampœ-3 text-sm leading-6 text-gray-600 md:h-48 overflow-hidden text-ellipsis">
                        {post.abstract}
                    </p>
                )}
            </div>
            {!hideAuthor && (
                <div className="hidden md:block">
                    <Author post={post} />
                </div>
            )}
        </article>
    );
}
