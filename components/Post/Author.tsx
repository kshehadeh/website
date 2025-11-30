import React from 'react';
import { BlogPostBrief } from '@/lib/blog';
import Image from 'next/image';
import Link from 'next/link';

export function Author({ post }: { post: BlogPostBrief }) {
    if (!post.author) return null;

    return (
        <div className="relative mt-8 flex items-center gap-x-4">
            <Image
                src={post.author.image}
                alt={post.author.name}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full bg-muted border border-border"
            />
            <div className="leading-6">
                <p className="text-foreground font-medium">
                    <Link
                        href={post.author.href}
                        className="hover:text-primary transition-colors"
                    >
                        <span className="absolute inset-0" />
                        {post.author.name}
                    </Link>
                </p>
                <p className="text-muted-foreground text-sm">
                    {post.author.role}
                </p>
            </div>
        </div>
    );
}
