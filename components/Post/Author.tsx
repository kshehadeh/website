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
                className="h-10 w-10 rounded-full bg-gray-50"
            />
            <div className="leading-6">
                <p className="text-gray-900">
                    <Link href={post.author.href}>
                        <span className="absolute inset-0" />
                        {post.author.name}
                    </Link>
                </p>
                <p className="text-gray-600">{post.author.role}</p>
            </div>
        </div>
    );
}
