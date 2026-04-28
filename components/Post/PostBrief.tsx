import { BlogPostBrief } from '@/lib/blog';
import React from 'react';
import PostTime from './PostTime';
import { Author } from './Author';
import { TagList } from '../TagList/TagList';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/util';

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
        <Card
            key={post.id}
            className="flex flex-col m-0 p-0 h-full md:h-[32rem] overflow-hidden hover:shadow-lg transition-shadow"
        >
            <div
                className="hidden md:block w-full aspect-[4/3] flex-none bg-cover bg-center rounded-t-xl"
                style={{ backgroundImage: `url(${post.coverUrl})` }}
            />
            <CardHeader className="group relative pb-3 min-h-0 flex-1 flex flex-col">
                <h3 className="md:mt-3 mt-1 font-semibold text-lg leading-6 text-card-foreground group-hover:text-primary transition-colors font-mono">
                    <a href={post.href}>
                        <span className="absolute inset-0" />
                        {post.title}
                    </a>
                </h3>

                <div className="flex items-center gap-x-4 mt-2">
                    {!hideDate && <PostTime post={post} />}
                    {!hideTags && <TagList tags={post.tags} type={'blog'} />}
                </div>

                {!hideAbstract && (
                    <p
                        className={cn(
                            'relative mt-5 leading-6 text-muted-foreground overflow-hidden flex-1',
                            'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-16',
                            'after:bg-gradient-to-b after:to-card after:from-transparent',
                        )}
                    >
                        {post.abstract}
                    </p>
                )}
            </CardHeader>
            {!hideAuthor && (
                <CardContent className="hidden md:block pt-0">
                    <Author post={post} />
                </CardContent>
            )}
        </Card>
    );
}
