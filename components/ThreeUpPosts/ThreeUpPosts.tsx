import { BlogPostBrief } from '@/lib/blog';
import React from 'react';
import PostTime from '../Post/PostTime';
import { Author } from '../Post/Author';

export default function ThreeUpPosts({ posts }: { posts: BlogPostBrief[] }) {
    return (
        <div className="bg-white py-12 sm:py-12">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:mx-0">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        From the blog
                    </h2>
                </div>
                <div className="mx-auto mt-5 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {posts.map(post => (
                        <article
                            key={post.id}
                            className="flex max-w-xl flex-col justify-between"
                        >
                            <div className="h-32 grow bg-cover" style={{backgroundImage:`url(${post.coverUrl})`}} />
                            
                            <div className="flex items-center gap-x-4 text-xs">
                                <PostTime post={post} />
                                {post.tags.map(tag => <a
                                    key={`${post.id}-${tag}-tag`}
                                    href={`/blog/tag/${tag}`}
                                    className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
                                >
                                    {tag}
                                </a>)}
                            </div>
                            <div className="group relative">
                                <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                                    <a href={post.href}>
                                        <span className="absolute inset-0" />
                                        {post.title}
                                    </a>
                                </h3>
                                <p className="mt-5 line-clampœ-3 text-sm leading-6 text-gray-600 h-48 overflow-hidden text-ellipsis">
                                    {post.abstract}
                                </p>
                            </div>
                            <Author post={post}/>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
}
